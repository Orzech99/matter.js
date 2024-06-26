[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [util/export](../modules/util_export.md) / IndexedSet

# Interface: IndexedSet\<T\>

[util/export](../modules/util_export.md).IndexedSet

An interface for index set lookup.

## Type parameters

| Name |
| :------ |
| `T` |

## Implemented by

- [`BasicSet`](../classes/util_export.BasicSet.md)

## Table of contents

### Methods

- [get](util_export.IndexedSet.md#get)

## Methods

### get

▸ **get**\<`F`\>(`field`, `value`): `undefined` \| `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `F` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `F` |
| `value` | `T`[`F`] |

#### Returns

`undefined` \| `T`

#### Defined in

[packages/matter.js/src/util/Set.ts:39](https://github.com/project-chip/matter.js/blob/2d9f2165d2672864fda3496a6d0d5f93597f82c6/packages/matter.js/src/util/Set.ts#L39)
