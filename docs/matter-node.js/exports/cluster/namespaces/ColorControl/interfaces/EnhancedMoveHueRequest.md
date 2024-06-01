[**@project-chip/matter-node.js**](../../../../../README.md) • **Docs**

***

[@project-chip/matter-node.js](../../../../../modules.md) / [exports/cluster](../../../README.md) / [ColorControl](../README.md) / EnhancedMoveHueRequest

# Interface: EnhancedMoveHueRequest

Input to the ColorControl enhancedMoveHue command

## See

MatterSpecification.v11.Cluster § 3.2.11.16

## Extends

- [`TypeFromSchema`](../../../../tlv/README.md#typefromschemas)\<*typeof* [`TlvEnhancedMoveHueRequest`](../README.md#tlvenhancedmovehuerequest)\>

## Properties

### moveMode

> **moveMode**: [`MoveMode`](../enumerations/MoveMode.md)

This field is identical to the MoveMode field of the MoveHue command of the Color Control cluster (see
sub-clause MoveHue Command). If the MoveMode field is equal to 0 (Stop), the Rate field shall be ignored.

#### See

MatterSpecification.v11.Cluster § 3.2.11.16.1

#### Inherited from

`TypeFromSchema.moveMode`

#### Source

packages/matter.js/dist/esm/cluster/definitions/ColorControlCluster.d.ts:584

***

### optionsMask

> **optionsMask**: [`TypeFromPartialBitSchema`](../../../../schema/README.md#typefrompartialbitschemat)\<`object`\>

#### Type declaration

##### executeIfOff

> **executeIfOff**: [`BitFlag`](../../../../schema/README.md#bitflag)

#### Inherited from

`TypeFromSchema.optionsMask`

#### Source

packages/matter.js/dist/esm/cluster/definitions/ColorControlCluster.d.ts:594

***

### optionsOverride

> **optionsOverride**: [`TypeFromPartialBitSchema`](../../../../schema/README.md#typefrompartialbitschemat)\<`object`\>

#### Type declaration

##### executeIfOff

> **executeIfOff**: [`BitFlag`](../../../../schema/README.md#bitflag)

#### Inherited from

`TypeFromSchema.optionsOverride`

#### Source

packages/matter.js/dist/esm/cluster/definitions/ColorControlCluster.d.ts:597

***

### rate

> **rate**: `number`

The Rate field specifies the rate of movement in steps per second. A step is a change in the extended hue of
a device by one unit. If the MoveMode field is set to 1 (up) or 3 (down) and the Rate field has a value of
zero, the command has no effect and a response command shall be sent in response, with the status code set
to INVALID_COMMAND. If the MoveMode field is set to 0 (stop) the Rate field shall be ignored.

#### See

MatterSpecification.v11.Cluster § 3.2.11.16.2

#### Inherited from

`TypeFromSchema.rate`

#### Source

packages/matter.js/dist/esm/cluster/definitions/ColorControlCluster.d.ts:593
