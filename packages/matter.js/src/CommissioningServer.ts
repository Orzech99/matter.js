/**
 * @license
 * Copyright 2022 The matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeviceCertification } from "./behavior/definitions/operational-credentials/DeviceCertification.js";
import { Ble } from "./ble/Ble.js";
import { AccessControlCluster } from "./cluster/definitions/AccessControlCluster.js";
import {
    AdministratorCommissioning,
    AdministratorCommissioningCluster,
} from "./cluster/definitions/AdministratorCommissioningCluster.js";
import { BasicInformationCluster } from "./cluster/definitions/BasicInformationCluster.js";
import {
    GeneralCommissioning,
    GeneralCommissioningCluster,
} from "./cluster/definitions/GeneralCommissioningCluster.js";
import { GeneralDiagnostics, GeneralDiagnosticsCluster } from "./cluster/definitions/GeneralDiagnosticsCluster.js";
import { GroupKeyManagementCluster } from "./cluster/definitions/GroupKeyManagementCluster.js";
import {
    NetworkCommissioning,
    NetworkCommissioningCluster,
} from "./cluster/definitions/NetworkCommissioningCluster.js";
import { OperationalCredentialsCluster } from "./cluster/definitions/OperationalCredentialsCluster.js";
import { AdministratorCommissioningHandler } from "./cluster/server/AdministratorCommissioningServer.js";
import { ClusterServer } from "./cluster/server/ClusterServer.js";
import { AttributeInitialValues, ClusterDatasource, ClusterServerObj } from "./cluster/server/ClusterServerTypes.js";
import { GeneralCommissioningClusterHandler } from "./cluster/server/GeneralCommissioningServer.js";
import { GroupKeyManagementClusterHandler } from "./cluster/server/GroupKeyManagementServer.js";
import { OperationalCredentialsClusterHandler } from "./cluster/server/OperationalCredentialsServer.js";
import { ImplementationError } from "./common/MatterError.js";
import { Crypto } from "./crypto/Crypto.js";
import { EndpointNumber } from "./datatype/EndpointNumber.js";
import { FabricIndex } from "./datatype/FabricIndex.js";
import { VendorId } from "./datatype/VendorId.js";
import { RootEndpoint } from "./device/Device.js";
import { EndpointInterface } from "./endpoint/EndpointInterface.js";
import { Logger } from "./log/Logger.js";
import { MdnsBroadcaster } from "./mdns/MdnsBroadcaster.js";
import { MdnsScanner } from "./mdns/MdnsScanner.js";
import { CommissioningOptions } from "./node/options/CommissioningOptions.js";
import { NetworkOptions } from "./node/options/NetworkOptions.js";
import { SubscriptionOptions } from "./node/options/SubscriptionOptions.js";
import { BaseNodeServer, DevicePairingInformation } from "./node/server/BaseNodeServer.js";
import { EventHandler } from "./protocol/interaction/EventHandler.js";
import { InteractionServer } from "./protocol/interaction/InteractionServer.js";
import { TypeFromBitSchema } from "./schema/BitmapSchema.js";
import { CommissioningFlowType, DiscoveryCapabilitiesBitmap, DiscoveryCapabilitiesSchema, ManualPairingCodeCodec, QrPairingCodeCodec } from "./schema/PairingCodeSchema.js";
import { PaseClient } from "./session/pase/PaseClient.js";
import { MatterCoreSpecificationV1_1 } from "./spec/Specifications.js";
import { StorageContext } from "./storage/StorageContext.js";
import { SupportedStorageTypes } from "./storage/StringifyTools.js";
import { ByteArray } from "./util/ByteArray.js";

const logger = Logger.get("CommissioningServer");

export const FORBIDDEN_PASSCODES = [
    0, 11111111, 22222222, 33333333, 44444444, 55555555, 66666666, 77777777, 88888888, 99999999, 12345678, 87654321,
];

/**
 * Data model revision used by this implementation
 * Value of 16 means "Matter 1.0/1.1"
 *
 * @see {@link MatterCoreSpecificationV1_1} § 7.1.1
 */
const MATTER_DATAMODEL_VERSION = 16;

export interface CommissioningServerOptions {
    /** Port of the server, normally automatically managed. */
    port?: number;

    /** IPv4 listener address, defaults to all interfaces.*/
    listeningAddressIpv4?: string;

    /** IPv6 listener address, defaults to all interfaces.*/
    listeningAddressIpv6?: string;

    /** The next endpoint ID to be assigned to a new endpoint. */
    nextEndpointId?: number;

    /** The passcode/pin of the device to use for initial commissioning. */
    passcode?: number;

    /** The Discriminator to use for initial commissioning. */
    discriminator?: number;

    /** The Flow type of the Commissioning flow used in announcements. */
    flowType?: CommissioningFlowType;

    /** Optional Vendor specific additional BLE Advertisement data. */
    additionalBleAdvertisementData?: ByteArray;

    /** Should the device directly be announced automatically by the MatterServer of manually via announce(). */
    delayedAnnouncement?: boolean;

    /**
     * Optional maximum subscription interval to use for sending subscription reports. It will be used if not too low
     * and inside the range requested by the connected controller.
     */
    subscriptionMaxIntervalSeconds?: number;

    /**
     * Optional minimum subscription interval to use for sending subscription reports. It will be used when other
     * calculated values are smaller than it. Use this to make sure your device hardware can handle the load and to set
     * limits.
     */
    subscriptionMinIntervalSeconds?: number;

    /**
     * Optional subscription randomization window to use for sending subscription reports. This specifies a window in
     * seconds from which a random part is added to the calculated maximum interval to make sure that devices that get
     * powered on in parallel not all send at the same timepoint.
     */
    subscriptionRandomizationWindowSeconds?: number;

    /**
     * Vendor specific certificates to be used for the OperationalCredentials cluster. If not set Test certificates
     * (official Chip tool test Root certificate is used) are generated automatically.
     */
    certification?: DeviceCertification.Configuration;

    /**
     * This callback is called when the device is commissioned or decommissioned to a fabric/controller. The provided
     * fabricIndex can be used together with getCommissionedFabricInformation() to get more details about the fabric
     * (or if this fabricIndex is missing it was deleted).
     */
    commissioningChangedCallback?: (fabricIndex: FabricIndex) => void;

    /**
     * This callback is called when sessions to the device are established, closed or subscriptions get added or
     * removed. The provided fabricIndex can be used together with getActiveSessionInformation() to get more details
     * about the open sessions and their status.
     */
    activeSessionsChangedCallback?: (fabricIndex: FabricIndex) => void;

    /** The device name to be used for the BasicInformation cluster. */
    deviceName: string;

    /** The device type to be used for the BasicInformation cluster. */
    deviceType: number;

    /**
     * Device details to be used for the BasicInformation cluster. Some of the values are initialized with defaults if
     * not set here.
     */
    basicInformation:
        | {
              vendorId: number;
              vendorName: string;
              productId: number;
              productName: string;
          }
        | AttributeInitialValues<typeof BasicInformationCluster.attributes>;

    /**
     * Optional configuration for the GeneralCommissioning cluster. If not set the default values are used.
     * Use these options to limit the allowed countries for regulatory configuration.
     */
    generalCommissioning?: Partial<AttributeInitialValues<typeof GeneralCommissioningCluster.attributes>> & {
        allowCountryCodeChange?: boolean; // Default true if not set
        countryCodeWhitelist?: string[]; // Default all countries are allowed
    };

    /**
     * The root endpoint is managed by the server.
     */
    rootEndpoint?: undefined;
}

/**
 * A CommissioningServer node represent a matter node that can be paired with a controller and runs on a defined port on the
 * host
 *
 * @deprecated use NodeServer
 */
export class CommissioningServer extends BaseNodeServer {
    #commissioningChangedCallback: CommissioningServerOptions["commissioningChangedCallback"];
    #activeSessionsChangedCallback: CommissioningServerOptions["activeSessionsChangedCallback"];
    #storage?: StorageContext;
    #endpointStructureStorage?: StorageContext;
    #subscriptionOptions: SubscriptionOptions;
    #eventHandler?: EventHandler;

    protected override networkConfig: NetworkOptions.Configuration;
    protected override commissioningConfig: CommissioningOptions.Configuration;
    protected override rootEndpoint: EndpointInterface;
    protected override nextEndpointId: EndpointNumber;
    protected override advertiseOnStartup: boolean;

    protected override get sessionStorage() {
        return this.storage.createContext("SessionManager")
    }

    protected override get fabricStorage() {
        return this.storage.createContext("FabricManager");
    }

    /**
     * Obtain the storage context.  
     */
    get storage() {
        if (this.#storage === undefined) {
            throw new ImplementationError(
                "Storage not initialized. The instance was not added to a Matter instance yet.",
            );
        }
        return this.#storage;
    }

    /**
     * Set the storage context.  Should be only used internally
     */
    set storage(storage: StorageContext) {
        this.#storage = storage;
        this.#endpointStructureStorage = this.#storage.createContext("EndpointStructure");
    }

    /**
     * Creates a new CommissioningServer node and add all needed Root clusters
     *
     * @param options The options for the CommissioningServer node
     */
    constructor(readonly options: CommissioningServerOptions) {
        super();

        this.#commissioningChangedCallback = options.commissioningChangedCallback;
        this.#activeSessionsChangedCallback = options.activeSessionsChangedCallback;

        this.networkConfig = NetworkOptions.configurationFor({
            // TODO - For CommissioningServerOptions, undefined port means
            // "automatic".  For NetworkOptions undefined means default (5540)
            // and 0 means automatic.  "Auto" is nice to support but not sure
            // it should be the default.  Need to confirm
            port: options.port ?? 0,
            listeningAddressIpv4: options.listeningAddressIpv4,
            listeningAddressIpv6: options.listeningAddressIpv6,
        });

        this.#subscriptionOptions = {
            maxIntervalSeconds: options.subscriptionMaxIntervalSeconds,
            minIntervalSeconds: options.subscriptionMinIntervalSeconds,
            randomizationWindowSeconds: options.subscriptionRandomizationWindowSeconds,
        };

        if (options.passcode !== undefined && FORBIDDEN_PASSCODES.includes(options.passcode)) {
            throw new ImplementationError(`Passcode ${options.passcode} is not allowed`);
        }

        this.commissioningConfig = {
            productDescription: {
                name: options.deviceName,
                deviceType: options.deviceType,
                vendorId: VendorId(options.basicInformation.vendorId),
                productId: options.basicInformation.productId,
            },

            passcode: options.passcode ?? PaseClient.generateRandomPasscode(),
            discriminator: options.discriminator ?? PaseClient.generateRandomDiscriminator(),

            flowType: options.flowType ?? CommissioningFlowType.Standard,
            additionalBleAdvertisementData: options.additionalBleAdvertisementData,
            automaticAnnouncement: !options.delayedAnnouncement,
            ble: Ble.enabled,
        };

        this.nextEndpointId = EndpointNumber(options.nextEndpointId ?? 1);
        this.advertiseOnStartup = !options.delayedAnnouncement;

        this.rootEndpoint = new RootEndpoint();

        // Set the required basicInformation and respect the provided values
        // TODO Get the defaults from the cluster meta details
        const basicInformationAttributes = Object.assign(
            {
                dataModelRevision: MATTER_DATAMODEL_VERSION,
                nodeLabel: "",
                hardwareVersion: 0,
                hardwareVersionString: "0",
                location: "XX",
                localConfigDisabled: false,
                softwareVersion: 1,
                softwareVersionString: "v1",
                capabilityMinima: {
                    caseSessionsPerFabric: 3, // TODO get that limit from Sessionmanager or such or sync with it, add limit?
                    subscriptionsPerFabric: 3, // TODO get that limit from Interactionserver? Respect it?
                },
                serialNumber: `node-matter-${Crypto.get().getRandomData(4).toHex()}`,
            },
            options.basicInformation,
        ) as AttributeInitialValues<typeof BasicInformationCluster.attributes>;

        const reachabilitySupported = basicInformationAttributes.reachable !== undefined;
        // Add basic Information cluster to root directly because it is not allowed to be changed afterward
        const basicInformationCluster = ClusterServer(
            BasicInformationCluster,
            basicInformationAttributes,
            {},
            {
                startUp: true,
                shutDown: true,
                reachableChanged: reachabilitySupported,
                leave: true,
            },
        );
        this.rootEndpoint.addClusterServer(basicInformationCluster);

        if (reachabilitySupported) {
            basicInformationCluster.subscribeReachableAttribute(newValue =>
                basicInformationCluster.triggerReachableChangedEvent?.({ reachableNewValue: newValue }),
            );
        }

        // Use provided certificates for OperationalCredentialsCluster or generate own ones
        const certification = new DeviceCertification(
            options.certification,
            this.commissioningConfig.productDescription,
        );

        // Add Operational credentials cluster to root directly because it is not allowed to be changed afterward
        // TODO Get the defaults from the cluster meta details
        this.rootEndpoint.addClusterServer(
            ClusterServer(
                OperationalCredentialsCluster,
                {
                    nocs: [],
                    fabrics: [],
                    supportedFabrics: 254, // maximum number of fabrics. Also FabricBuilder uses 254 as max!
                    commissionedFabrics: 0,
                    trustedRootCertificates: [],
                    currentFabricIndex: FabricIndex.NO_FABRIC,
                },
                OperationalCredentialsClusterHandler(certification),
            ),
        );

        // TODO Get the defaults from the cluster meta details
        const generalCommissioning = options.generalCommissioning;
        this.rootEndpoint.addClusterServer(
            ClusterServer(
                GeneralCommissioningCluster,
                {
                    breadcrumb: generalCommissioning?.breadcrumb ?? BigInt(0),
                    basicCommissioningInfo: generalCommissioning?.basicCommissioningInfo ?? {
                        failSafeExpiryLengthSeconds: 60 /* 1min */,
                        maxCumulativeFailsafeSeconds: 900 /* Recommended according to Specs */,
                    },
                    regulatoryConfig:
                        generalCommissioning?.regulatoryConfig ?? GeneralCommissioning.RegulatoryLocationType.Outdoor, // Default is the most restrictive one
                    locationCapability:
                        generalCommissioning?.locationCapability ??
                        GeneralCommissioning.RegulatoryLocationType.IndoorOutdoor,
                    supportsConcurrentConnection: generalCommissioning?.supportsConcurrentConnection ?? true,
                },
                GeneralCommissioningClusterHandler({
                    allowCountryCodeChange: generalCommissioning?.allowCountryCodeChange ?? true,
                    countryCodeWhitelist: generalCommissioning?.countryCodeWhitelist ?? undefined,
                }),
            ),
        );

        const networkId = new ByteArray(32);
        // TODO Get the defaults from the cluster meta details
        this.rootEndpoint.addClusterServer(
            ClusterServer(
                NetworkCommissioningCluster.with("EthernetNetworkInterface"),
                {
                    maxNetworks: 1,
                    interfaceEnabled: true,
                    lastConnectErrorValue: 0,
                    lastNetworkId: networkId,
                    lastNetworkingStatus: NetworkCommissioning.NetworkCommissioningStatus.Success,
                    networks: [{ networkId: networkId, connected: true }],
                },
                {}, // Ethernet is not requiring any methods
            ),
        );

        // TODO Get the defaults from the cluster meta details
        this.rootEndpoint.addClusterServer(
            ClusterServer(
                AccessControlCluster,
                {
                    acl: [],
                    extension: [],
                    subjectsPerAccessControlEntry: 4,
                    targetsPerAccessControlEntry: 4,
                    accessControlEntriesPerFabric: 4,
                },
                {},
                {
                    accessControlEntryChanged: true, // TODO
                    accessControlExtensionChanged: true, // TODO
                },
            ),
        );

        // TODO Get the defaults from the cluster meta details
        this.rootEndpoint.addClusterServer(
            ClusterServer(
                GroupKeyManagementCluster,
                {
                    groupKeyMap: [],
                    groupTable: [],
                    maxGroupsPerFabric: 1, // TODO: Increase once we add group support, for now only IPK is supported
                    maxGroupKeysPerFabric: 1,
                },
                GroupKeyManagementClusterHandler(),
            ),
        );

        // TODO Get the defaults from the cluster meta details
        this.rootEndpoint.addClusterServer(
            ClusterServer(
                GeneralDiagnosticsCluster,
                {
                    networkInterfaces: [],
                    rebootCount: 0,
                    upTime: 0,
                    totalOperationalHours: 0,
                    bootReason: GeneralDiagnostics.BootReason.Unspecified,
                    activeHardwareFaults: [],
                    activeRadioFaults: [],
                    activeNetworkFaults: [],
                    testEventTriggersEnabled: false,
                },
                {
                    testEventTrigger: async args => await this.commandHandler.executeHandler("testEventTrigger", args),
                },
                {
                    bootReason: true,
                },
            ),
        );

        this.rootEndpoint.addClusterServer(
            ClusterServer(
                AdministratorCommissioningCluster,
                {
                    windowStatus: AdministratorCommissioning.CommissioningWindowStatus.WindowNotOpen,
                    adminFabricIndex: null,
                    adminVendorId: null,
                },
                AdministratorCommissioningHandler(),
            ),
        );

        // We must register this event before creating an InteractionServer so
        // we initialize endpoint datasources before the InteractionServer
        // processes events
        this.endpointStructure.change.on(() => {
            for (const endpoint of this.endpointStructure.endpoints.values()) {
                for (const cluster of endpoint.getAllClusterServers()) {
                    new CommissioningServerClusterDatasource(
                        endpoint,
                        cluster,
                        this.storage,
                        this.eventHandler
                    );
                }
            }
        })
    }

    /**
     * @deprecated use {@link BaseNodeServer.commissioned}
     */
    isCommissioned() {
        return this.commissioned;
    }
    
    /**
     * @deprecated use {@link BaseNodeServer.mdnsScanner}
     */
    setMdnsScanner(mdnsScanner: MdnsScanner) {
        this.mdnsScanner = mdnsScanner;
    }

    /**
     * @deprecated use {@link BaseNodeServer.mdnsBroadcaster}
     */
    setMdnsBroadcaster(mdnsBroadcaster: MdnsBroadcaster) {
        this.mdnsBroadcaster = mdnsBroadcaster;
    }

    /**
     * @deprecated use {@link BaseNodeServer.storage}
     */
    setStorage(storage: StorageContext) {
        this.storage = storage;
    }

    /**
     * @deprecated use {@link BaseNodeServer.port}
     */
    getPort() {
        return this.port;
    }

    /**
     * @deprecated use {@link BaseNodeServer.port}
     */
    setPort(port: number) {
        this.port = port;
    }

    /**
     * Return the pairing information for the device
     */
    getPairingCode(
        discoveryCapabilities?: TypeFromBitSchema<typeof DiscoveryCapabilitiesBitmap>,
    ): DevicePairingInformation {
        const basicInformation = this.getRootClusterServer(BasicInformationCluster);
        if (basicInformation == undefined) {
            throw new ImplementationError("BasicInformationCluster needs to be set!");
        }
        if (this.commissioningConfig === undefined) {
            throw new ImplementationError("Pairing code is unavailable because commissioning is not configured");
        }

        const vendorId = basicInformation.attributes.vendorId.getLocal();
        const productId = basicInformation.attributes.productId.getLocal();

        let bleEnabled = Ble.enabled;

        const qrPairingCode = QrPairingCodeCodec.encode({
            version: 0,
            vendorId: vendorId,
            productId,
            flowType: this.commissioningConfig.flowType,
            discriminator: this.commissioningConfig.discriminator,
            passcode: this.commissioningConfig.passcode,
            discoveryCapabilities: DiscoveryCapabilitiesSchema.encode(
                discoveryCapabilities ?? {
                    ble: bleEnabled,
                    softAccessPoint: false,
                    onIpNetwork: true,
                },
            ),
        });

        return {
            manualPairingCode: ManualPairingCodeCodec.encode({
                discriminator: this.commissioningConfig.discriminator,
                passcode: this.commissioningConfig.passcode,
            }),
            qrPairingCode,
        };
    }

    updateStructure() {
        logger.debug("Endpoint structure got updated ...");
        this.assignEndpointIds(); // Make sure to have unique endpoint ids
        this.rootEndpoint.updatePartsList(); // update parts list of all Endpoint objects with final IDs
        this.endpointStructure.initializeFromEndpoint(this.rootEndpoint); // Reinitialize the interaction server structure
    }

    getNextEndpointId(increase = true) {
        if (increase) {
            this.nextEndpointId++;
        }
        return this.nextEndpointId;
    }

    assignEndpointIds() {
        const rootUniqueIdPrefix = this.rootEndpoint.determineUniqueID();
        this.initializeEndpointIdsFromStorage(this.rootEndpoint, rootUniqueIdPrefix);
        this.fillAndStoreEndpointIds(this.rootEndpoint, rootUniqueIdPrefix);
        this.#endpointStructureStorage?.set("nextEndpointId", this.nextEndpointId);
    }

    private initializeEndpointIdsFromStorage(endpoint: EndpointInterface, parentUniquePrefix = "") {
        if (this.#endpointStructureStorage === undefined) {
            throw new ImplementationError("Storage manager must be initialized to enable initialization from storage.");
        }
        const endpoints = endpoint.getChildEndpoints();
        for (let endpointIndex = 0; endpointIndex < endpoints.length; endpointIndex++) {
            let endpointUniquePrefix = parentUniquePrefix;
            const endpoint = endpoints[endpointIndex];
            const thisUniqueId = endpoint.determineUniqueID();
            if (thisUniqueId === undefined) {
                if (endpoint.number === undefined) {
                    logger.debug(
                        `No unique id found for endpoint on index ${endpointIndex} / device ${endpoint.name} - using index as unique identifier!`,
                    );
                }
                endpointUniquePrefix += `${endpointUniquePrefix === "" ? "" : "-"}index_${endpointIndex}`;
            } else {
                endpointUniquePrefix += `${endpointUniquePrefix === "" ? "" : "-"}${thisUniqueId}`;
            }

            if (endpoint.number === undefined) {
                if (this.#endpointStructureStorage.has(endpointUniquePrefix)) {
                    endpoint.number = this.#endpointStructureStorage.get<EndpointNumber>(endpointUniquePrefix);
                    logger.debug(
                        `Restored endpoint id ${endpoint.number} for endpoint with ${endpointUniquePrefix} / device ${endpoint.name} from storage`,
                    );
                }
            }
            if (endpoint.number !== undefined && endpoint.number > this.nextEndpointId) {
                this.nextEndpointId = EndpointNumber(endpoint.number + 1);
            }
            this.initializeEndpointIdsFromStorage(endpoint, endpointUniquePrefix);
        }
    }

    private fillAndStoreEndpointIds(endpoint: EndpointInterface, parentUniquePrefix = "") {
        if (this.#endpointStructureStorage === undefined) {
            throw new ImplementationError("endpointStructureStorage not set!");
        }
        const endpoints = endpoint.getChildEndpoints();
        for (let endpointIndex = 0; endpointIndex < endpoints.length; endpointIndex++) {
            let endpointUniquePrefix = parentUniquePrefix;
            endpoint = endpoints[endpointIndex];
            const thisUniqueId = endpoint.determineUniqueID();
            if (thisUniqueId === undefined) {
                endpointUniquePrefix += `${endpointUniquePrefix === "" ? "" : "-"}index_${endpointIndex}`;
            } else {
                endpointUniquePrefix += `${endpointUniquePrefix === "" ? "" : "-"}${thisUniqueId}`;
            }

            if (endpoint.number === undefined) {
                endpoint.number = EndpointNumber(this.nextEndpointId++);
                this.#endpointStructureStorage.set(endpointUniquePrefix, endpoint.number);
                logger.debug(
                    `Assigned endpoint id ${endpoint.number} for endpoint with ${endpointUniquePrefix} / device ${endpoint.name} and stored it`,
                );
            }
            this.fillAndStoreEndpointIds(endpoint, endpointUniquePrefix);
        }
    }

    protected initializeEndpoints() {
        if (
            this.#storage === undefined ||
            this.#endpointStructureStorage === undefined
        ) {
            throw new ImplementationError("Storage not initialized");
        }

        this.nextEndpointId = this.#endpointStructureStorage.get("nextEndpointId", this.nextEndpointId);

        this.assignEndpointIds(); // Make sure to have unique endpoint ids
        this.rootEndpoint.updatePartsList(); // initialize parts list of all Endpoint objects with final IDs
        this.rootEndpoint.setStructureChangedCallback(() => this.updateStructure()); // Make sure we get structure changes
    }

    protected override emitCommissioningChanged(fabric: FabricIndex): void {
        this.#commissioningChangedCallback?.(fabric);
    }

    protected override emitActiveSessionsChanged(fabric: FabricIndex): void {
        this.#activeSessionsChangedCallback?.(fabric);
    }

    protected override async clearStorage() {
        this.storage.clear();
    }

    protected override createInteractionServer() {
        return new InteractionServer({
            subscriptionOptions: this.#subscriptionOptions,
            eventHandler: this.eventHandler,
            endpointStructure: this.endpointStructure,
        })
    }

    protected get eventHandler() {
        if (!this.#eventHandler) {
            this.#eventHandler = new EventHandler(this.storage.createContext("EventHandler"));
        }
        return this.#eventHandler;
    }
}

class CommissioningServerClusterDatasource implements ClusterDatasource {
    #version: number;
    #clusterDescription: string;
    #storage: StorageContext;
    #eventHandler: EventHandler;
    
    constructor(
        endpoint: EndpointInterface,
        cluster: ClusterServerObj<any, any>,
        storage: StorageContext,
        eventHandler: EventHandler
    ) {
        this.#eventHandler = eventHandler;
        this.#clusterDescription = `cluster ${cluster.name} (${cluster.id})`;
        this.#storage = storage = storage.createContext(`Cluster-${endpoint.number}-${cluster.id}`);

        const version = storage.get<number>("_clusterDataVersion", cluster.datasource?.version ?? -1);
        if (version === -1) {
            this.#version = Crypto.getRandomUInt32();
        } else {
            this.#version = version;
        }

        logger.debug(
            `${storage.has("_clusterDataVersion") ? "Restore" : "Set"} cluster data version ${
                this.#version
            } in ${this.#clusterDescription}`,
        );
        storage.set("_clusterDataVersion", this.#version);

        for (const attributeName in cluster.attributes) {
            const attribute = cluster.attributes[attributeName];
            if (!attribute) {
                // Shouldn't be possible
                continue;
            }
            if (!this.#storage.has(attributeName)) continue;
            try {
                const value = storage.get<any>(attributeName);
                logger.debug(
                    `Restoring attribute ${attributeName} (${attribute.id}) in ${this.#clusterDescription}`,
                );
                attribute.init(value);
            } catch (error) {
                logger.warn(
                    `Failed to restore attribute ${attributeName} (${attribute.id}) in ${this.#clusterDescription}`,
                    error,
                );
                storage.delete(attribute.name); // Storage broken so we should delete it
            }
        }

        cluster.datasource = this;
    }

    get version() {
        return this.#version;
    }

    get eventHandler() {
        return this.#eventHandler;
    }

    increaseVersion(): number {
        if (this.#version === 0xffffffff) {
            this.#version = -1;
        }
        this.#storage?.set("_clusterDataVersion", ++this.#version);
        return this.#version;
    }

    changed(attributeName: string, value: SupportedStorageTypes) {
        if (value === undefined) return;
        logger.debug(`Storing attribute ${attributeName} in ${this.#clusterDescription}`);
        this.#storage?.set(attributeName, value);
    }
}
