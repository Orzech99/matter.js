[**@project-chip/matter.js**](../../../../../../README.md) • **Docs**

***

[@project-chip/matter.js](../../../../../../modules.md) / [endpoint/definitions/device/OnOffPlugInUnitDevice](../../README.md) / OnOffPlugInUnitRequirements

# Namespace: OnOffPlugInUnitRequirements

## Variables

### GroupsServer

> `const` **GroupsServer**: *typeof* [`GroupsServer`](../../../../../../behavior/definitions/groups/export/classes/GroupsServer.md) = `BaseGroupsServer`

The Groups cluster is required by the Matter specification

We provide this alias to the default implementation [GroupsServer](README.md#groupsserver) for convenience.

#### Source

[packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts:43](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts#L43)

***

### IdentifyServer

> `const` **IdentifyServer**: [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithAlterations`](../../../../../../cluster/export/namespaces/ElementModifier/README.md#withalterationstalterationst)\<[`Cluster`](../../../../../../cluster/export/namespaces/Identify/interfaces/Cluster.md), `object`\>, *typeof* [`IdentifyServer`](../../../../../../behavior/definitions/identify/export/namespaces/IdentifyServer/README.md), [`IdentifyInterface`](../../../../../../behavior/definitions/identify/export/README.md#identifyinterface)\>

The Identify cluster is required by the Matter specification

This version of [IdentifyServer](README.md#identifyserver) is specialized per the specification.

#### Source

[packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts:36](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts#L36)

***

### LevelControlServer

> `const` **LevelControlServer**: [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithAlterations`](../../../../../../cluster/export/namespaces/ElementModifier/README.md#withalterationstalterationst)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`Cluster`](../../../../../../cluster/export/namespaces/LevelControl/interfaces/Cluster.md), readonly [[`OnOff`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#onoff), [`Lighting`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#lighting)]\>, readonly [[`OnOff`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#onoff)]\>, readonly [`"OnOff"`, `"Lighting"`]\>, `object`\>, [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`Cluster`](../../../../../../cluster/export/namespaces/LevelControl/interfaces/Cluster.md), readonly [[`OnOff`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#onoff), [`Lighting`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#lighting)]\>, readonly [[`OnOff`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#onoff)]\>, readonly [`"OnOff"`, `"Lighting"`]\>, *typeof* [`LevelControlServer`](../../../../../../behavior/definitions/level-control/export/classes/LevelControlServer.md), [`LevelControlInterface`](../../../../../../behavior/definitions/level-control/export/README.md#levelcontrolinterface)\>, [`LevelControlInterface`](../../../../../../behavior/definitions/level-control/export/README.md#levelcontrolinterface)\>

The LevelControl cluster is optional per the Matter specification

This version of [LevelControlServer](README.md#levelcontrolserver) is specialized per the specification.

#### Source

[packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts:71](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts#L71)

***

### OnOffServer

> `const` **OnOffServer**: [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`Cluster`](../../../../../../cluster/export/namespaces/OnOff/interfaces/Cluster.md), readonly [[`LevelControlForLighting`](../../../../../../cluster/export/namespaces/OnOff/enumerations/Feature.md#levelcontrolforlighting)]\>, readonly [`"LevelControlForLighting"`]\>, *typeof* [`OnOffServer`](../../../../../../behavior/definitions/on-off/export/namespaces/OnOffServer/README.md), [`OnOffInterface`](../../../../../../behavior/definitions/on-off/export/README.md#onoffinterface)\>

The OnOff cluster is required by the Matter specification

This version of [OnOffServer](README.md#onoffserver) is specialized per the specification.

#### Source

[packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts:64](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts#L64)

***

### ScenesServer

> `const` **ScenesServer**: [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithAlterations`](../../../../../../cluster/export/namespaces/ElementModifier/README.md#withalterationstalterationst)\<[`Cluster`](../../../../../../cluster/export/namespaces/Scenes/interfaces/Cluster.md), `object`\>, *typeof* [`ScenesServer`](../../../../../../behavior/definitions/scenes/export/classes/ScenesServer.md), [`ScenesInterface`](../../../../../../behavior/definitions/scenes/export/README.md#scenesinterface)\>

The Scenes cluster is required by the Matter specification

This version of [ScenesServer](README.md#scenesserver) is specialized per the specification.

#### Source

[packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts:50](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts#L50)

***

### server

> `const` **server**: `object`

An implementation for each server cluster supported by the endpoint per the Matter specification.

#### Type declaration

##### mandatory

> **mandatory**: `object`

##### mandatory.Groups

> **Groups**: *typeof* [`GroupsServer`](../../../../../../behavior/definitions/groups/export/classes/GroupsServer.md) = `GroupsServer`

##### mandatory.Identify

> **Identify**: [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithAlterations`](../../../../../../cluster/export/namespaces/ElementModifier/README.md#withalterationstalterationst)\<[`Cluster`](../../../../../../cluster/export/namespaces/Identify/interfaces/Cluster.md), `object`\>, *typeof* [`IdentifyServer`](../../../../../../behavior/definitions/identify/export/namespaces/IdentifyServer/README.md), [`IdentifyInterface`](../../../../../../behavior/definitions/identify/export/README.md#identifyinterface)\> = `IdentifyServer`

##### mandatory.OnOff

> **OnOff**: [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`Cluster`](../../../../../../cluster/export/namespaces/OnOff/interfaces/Cluster.md), readonly [[`LevelControlForLighting`](../../../../../../cluster/export/namespaces/OnOff/enumerations/Feature.md#levelcontrolforlighting)]\>, readonly [`"LevelControlForLighting"`]\>, *typeof* [`OnOffServer`](../../../../../../behavior/definitions/on-off/export/namespaces/OnOffServer/README.md), [`OnOffInterface`](../../../../../../behavior/definitions/on-off/export/README.md#onoffinterface)\> = `OnOffServer`

##### mandatory.Scenes

> **Scenes**: [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithAlterations`](../../../../../../cluster/export/namespaces/ElementModifier/README.md#withalterationstalterationst)\<[`Cluster`](../../../../../../cluster/export/namespaces/Scenes/interfaces/Cluster.md), `object`\>, *typeof* [`ScenesServer`](../../../../../../behavior/definitions/scenes/export/classes/ScenesServer.md), [`ScenesInterface`](../../../../../../behavior/definitions/scenes/export/README.md#scenesinterface)\> = `ScenesServer`

##### optional

> **optional**: `object`

##### optional.LevelControl

> **LevelControl**: [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithAlterations`](../../../../../../cluster/export/namespaces/ElementModifier/README.md#withalterationstalterationst)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`Cluster`](../../../../../../cluster/export/namespaces/LevelControl/interfaces/Cluster.md), readonly [[`OnOff`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#onoff), [`Lighting`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#lighting)]\>, readonly [[`OnOff`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#onoff)]\>, readonly [`"OnOff"`, `"Lighting"`]\>, `object`\>, [`Type`](../../../../../../behavior/cluster/export/namespaces/ClusterBehavior/interfaces/Type.md)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`WithFeatures`](../../../../../../cluster/export/namespaces/ClusterComposer/README.md#withfeaturesclustertfeaturest)\<[`Cluster`](../../../../../../cluster/export/namespaces/LevelControl/interfaces/Cluster.md), readonly [[`OnOff`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#onoff), [`Lighting`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#lighting)]\>, readonly [[`OnOff`](../../../../../../cluster/export/namespaces/LevelControl/enumerations/Feature.md#onoff)]\>, readonly [`"OnOff"`, `"Lighting"`]\>, *typeof* [`LevelControlServer`](../../../../../../behavior/definitions/level-control/export/classes/LevelControlServer.md), [`LevelControlInterface`](../../../../../../behavior/definitions/level-control/export/README.md#levelcontrolinterface)\>, [`LevelControlInterface`](../../../../../../behavior/definitions/level-control/export/README.md#levelcontrolinterface)\> = `LevelControlServer`

#### Source

[packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts:84](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/endpoint/definitions/device/OnOffPlugInUnitDevice.ts#L84)
