[**@project-chip/matter.js**](../../../README.md) • **Docs**

***

[@project-chip/matter.js](../../../modules.md) / [util/export](../README.md) / Observable

# Interface: Observable\<T, R\>

A discrete event that may be monitored via callback.  Could call it "event" but that could be confused with Matter
cluster events and/or DOM events.

## Extends

- `AsyncIterable`\<`T`\>.`PromiseLike`\<`T`\>

## Extended by

- [`AsyncObservable`](AsyncObservable.md)

## Type parameters

| Type parameter | Value | Description |
| :------ | :------ | :------ |
| `T` *extends* `any`[] | `any`[] | arguments, should be a named tuple |
| `R` | `void` | - |

## Properties

### isAsync?

> `optional` **isAsync**: `boolean`

This flag indicates whether the observable is asynchronous.  Any observable that accepts promise returns may
be asynchronous but this information is not available at runtime unless you specify here, typically via
[AsyncObservable](../README.md#asyncobservable).

#### Source

[packages/matter.js/src/util/Observable.ts:70](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/util/Observable.ts#L70)

***

### isObserved

> **isObserved**: `boolean`

True if there is at least one observer registered.

#### Source

[packages/matter.js/src/util/Observable.ts:63](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/util/Observable.ts#L63)

## Methods

### `[asyncIterator]`()

> **\[asyncIterator\]**(): `AsyncIterator`\<`T`\[`0`\], `any`, `undefined`\>

Observable supports standard "for await (const value of observable").

Using an observer in this manner limits your listener to the first parameter normally emitted and your observer
cannot return a value.

#### Returns

`AsyncIterator`\<`T`\[`0`\], `any`, `undefined`\>

#### Overrides

`AsyncIterable.[asyncIterator]`

#### Source

[packages/matter.js/src/util/Observable.ts:78](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/util/Observable.ts#L78)

***

### `[dispose]`()

> **\[dispose\]**(): `void`

Release resources associated with the observable.

#### Returns

`void`

#### Source

[packages/matter.js/src/util/Observable.ts:83](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/util/Observable.ts#L83)

***

### emit()

> **emit**(...`args`): `undefined` \| `R`

Notify observers.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | `T` |

#### Returns

`undefined` \| `R`

#### Source

[packages/matter.js/src/util/Observable.ts:43](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/util/Observable.ts#L43)

***

### off()

> **off**(`observer`): `void`

Remove an observer.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `observer` | [`Observer`](Observer.md)\<`T`, `R`\> |

#### Returns

`void`

#### Source

[packages/matter.js/src/util/Observable.ts:53](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/util/Observable.ts#L53)

***

### on()

> **on**(`observer`): `void`

Add an observer.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `observer` | [`Observer`](Observer.md)\<`T`, `R`\> |

#### Returns

`void`

#### Source

[packages/matter.js/src/util/Observable.ts:48](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/util/Observable.ts#L48)

***

### once()

> **once**(`observer`): `void`

Add an observer that emits once then is unregistered.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `observer` | [`Observer`](Observer.md)\<`T`, `R`\> |

#### Returns

`void`

#### Source

[packages/matter.js/src/util/Observable.ts:58](https://github.com/project-chip/matter.js/blob/7a8cbb56b87d4ccf34bec5a9a95ab40a1711324f/packages/matter.js/src/util/Observable.ts#L58)
