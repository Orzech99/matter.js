[**@project-chip/matter.js**](../../../../../README.md) • **Docs**

***

[@project-chip/matter.js](../../../../../modules.md) / [cluster/export](../../../README.md) / [Actions](../README.md) / StartActionRequest

# Interface: StartActionRequest

Input to the Actions startAction command

## See

MatterSpecification.v11.Core § 9.14.6.3

## Extends

- [`TypeFromSchema`](../../../../../tlv/export/README.md#typefromschemas)\<*typeof* [`TlvStartActionRequest`](../README.md#tlvstartactionrequest)\>

## Properties

### actionId

> **actionId**: `number`

#### Inherited from

`TypeFromSchema.actionId`

#### Source

[packages/matter.js/src/cluster/definitions/ActionsCluster.ts:410](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/cluster/definitions/ActionsCluster.ts#L410)

***

### invokeId?

> `optional` **invokeId**: `number`

#### Inherited from

`TypeFromSchema.invokeId`

#### Source

[packages/matter.js/src/cluster/definitions/ActionsCluster.ts:411](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/cluster/definitions/ActionsCluster.ts#L411)
