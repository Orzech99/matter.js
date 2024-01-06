/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { TemperatureMeasurement } from "../../../cluster/definitions/TemperatureMeasurementCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";

/**
 * TemperatureMeasurementBehavior is the base class for objects that support interaction with {@link
 * TemperatureMeasurement.Cluster}.
 */
export const TemperatureMeasurementBehavior = ClusterBehavior.for(TemperatureMeasurement.Cluster);

type TemperatureMeasurementBehaviorType = InstanceType<typeof TemperatureMeasurementBehavior>;
export interface TemperatureMeasurementBehavior extends TemperatureMeasurementBehaviorType {}
type StateType = InstanceType<typeof TemperatureMeasurementBehavior.State>;
export namespace TemperatureMeasurementBehavior { export interface State extends StateType {} }
