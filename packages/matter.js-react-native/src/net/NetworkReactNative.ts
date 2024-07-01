/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import dgram from "react-native-udp";

// @ts-expect-error globalThis is no index structure
global.dgram = dgram;

import { Logger } from "@project-chip/matter.js/log";
import {
    InterfaceType,
    Network,
    NetworkError,
    NetworkInterface,
    NetworkInterfaceDetails,
    UdpChannel,
    UdpChannelOptions,
} from "@project-chip/matter.js/net";
import { AsyncCache, isIPv6, onSameNetwork } from "@project-chip/matter.js/util";
import { fetch as fetchNetworkInfo } from "@react-native-community/netinfo";
import { UdpChannelReactNative } from "./UdpChannelReactNative.js";

const logger = Logger.get("NetworkNode");

type NetworkInterfaceInfo = {
    address: string;
    family: string;
    netmask: string;
    internal: boolean;
};

async function networkInterfaces() {
    const netInfo = [await fetchNetworkInfo("wifi"), await fetchNetworkInfo("ethernet")];
    const networkInterfaces: Record<string, NetworkInterfaceInfo[]> = {};
    netInfo.forEach(({ type, isConnected, details }) => {
        if (!details || !isConnected) return;
        const ipAddress = "ipAddress" in details ? (details.ipAddress as string | null) : undefined;
        const subnet = "subnet" in details ? (details.subnet as string | null) : undefined;
        if (!ipAddress || !subnet) return;
        networkInterfaces[type] = [
            {
                address: ipAddress,
                family: isIPv6(ipAddress) ? "IPv6" : "IPv4",
                netmask: subnet,
                internal: false,
            },
        ];
    });
    return networkInterfaces;
}

export class NetworkReactNative extends Network {
    static async getMulticastInterfaceIpv4(netInterface: string): Promise<string | undefined> {
        const netInterfaceInfo = (await networkInterfaces())[netInterface];
        if (netInterfaceInfo === undefined) throw new NetworkError(`Unknown interface: ${netInterface}`);
        for (const { address, family } of netInterfaceInfo) {
            if (family === "IPv4") {
                return address;
            }
        }
        return undefined;
    }

    static async getMembershipMulticastInterfaces(
        netInterface: string | undefined,
        ipv4: boolean,
    ): Promise<(string | undefined)[]> {
        if (ipv4) {
            return [undefined];
        } else {
            let networkInterfaceEntries = Object.entries(await networkInterfaces());
            if (netInterface !== undefined) {
                networkInterfaceEntries = networkInterfaceEntries.filter(([name]) => name === netInterface);
            }
            const multicastInterfaces = networkInterfaceEntries.flatMap(([netInterface, netInterfaceInfo]) => {
                if (netInterfaceInfo === undefined) return [];
                const zone = netInterface;
                return zone === undefined ? [] : [`::%${zone}`];
            });
            if (multicastInterfaces.length === 0) {
                logger.warn(
                    `No IPv6 multicast interface found${
                        netInterface !== undefined ? ` for interface ${netInterface}` : ""
                    }.`,
                );
            }
            return multicastInterfaces;
        }
    }

    static getNetInterfaceForIp(ip: string) {
        // Finding the local interface on the same interface is complex and won't change
        // So let's cache the results for 5mn
        return this.netInterfaces.get(ip);
    }

    private static readonly netInterfaces = new AsyncCache<string | undefined>(
        "Network interface",
        (ip: string) => this.getNetInterfaceForRemoveAddress(ip),
        5 * 60 * 1000 /* 5mn */,
    );

    override async close() {
        await NetworkReactNative.netInterfaces.close();
    }

    private static async getNetInterfaceForRemoveAddress(ip: string) {
        if (ip.includes("%")) {
            // IPv6 address with scope
            return ip.split("%")[1];
        } else {
            const interfaces = await networkInterfaces();
            for (const name in interfaces) {
                const netInterfaces = interfaces[name] as NetworkInterfaceInfo[];
                for (const { address, netmask } of netInterfaces) {
                    if (onSameNetwork(ip, address, netmask)) {
                        return name;
                    }
                }
            }
            if (isIPv6(ip)) {
                if (ip.startsWith("fd")) {
                    // IPv6 address is an ULA
                    return ""; // consider it as being ok and using the "Default interface"
                }
            }
            return undefined;
        }
    }

    /**
     * Get all network interfaces.
     * The optional configuration parameter allows to map interface names to types if this mapping is known.
     * Each network interface which has no mapped type is returned as Ethernet for now.
     *
     * @param configuration - An array of objects with the name and type properties.
     */
    async getNetInterfaces(configuration: NetworkInterface[] = []): Promise<NetworkInterface[]> {
        const result = new Array<NetworkInterface>();
        const interfaces = await networkInterfaces();
        for (const name in interfaces) {
            const netInterfaces = interfaces[name] as NetworkInterfaceInfo[];
            if (netInterfaces.length === 0) continue;
            if (netInterfaces[0].internal) continue;
            let type = InterfaceType.Ethernet;
            if (configuration.length > 0) {
                const nameType = configuration.find(({ name: mapName }) => name === mapName);
                if (nameType !== undefined && nameType.type !== undefined) {
                    type = nameType.type;
                }
            }
            result.push({ name, type });
        }
        return result;
    }

    async getIpMac(netInterface: string): Promise<NetworkInterfaceDetails | undefined> {
        const netInterfaceInfo = (await networkInterfaces())[netInterface];
        if (netInterfaceInfo === undefined) return undefined;
        const ipV4 = netInterfaceInfo.filter(({ family }) => family === "IPv4").map(({ address }) => address);
        const ipV6 = netInterfaceInfo.filter(({ family }) => family === "IPv6").map(({ address }) => address);
        return { mac: "00:00:00:00:00:00", ipV4, ipV6 };
    }

    override createUdpChannel(options: UdpChannelOptions): Promise<UdpChannel> {
        return UdpChannelReactNative.create(options);
    }
}
