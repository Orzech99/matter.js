/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Binding } from "../../../cluster/definitions/BindingCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";

/**
 * BindingBehavior is the base class for objects that support interaction with {@link Binding.Cluster}.
 */
export const BindingBehavior = ClusterBehavior.for(Binding.Cluster);

type BindingBehaviorType = InstanceType<typeof BindingBehavior>;
export interface BindingBehavior extends BindingBehaviorType {}
type StateType = InstanceType<typeof BindingBehavior.State>;
export namespace BindingBehavior { export interface State extends StateType {} }
