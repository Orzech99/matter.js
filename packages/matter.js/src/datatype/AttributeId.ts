/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { tryCatch } from "../common/TryCatchHandler.js";
import { ValidationError, ValidationOutOfBoundsError } from "../common/ValidationError.js";
import { TlvUInt32 } from "../tlv/TlvNumber.js";
import { TlvWrapper } from "../tlv/TlvWrapper.js";
import { Branded } from "../util/Type.js";
import { fromMEI } from "./ManufacturerExtensibleIdentifier.js";

/**
 * An Attribute ID is a 32 bit number and indicates an attribute defined in a cluster specification.
 *
 * @see {@link MatterSpecification.v10.Core} § 7.18.2.15
 */
export type AttributeId = Branded<number, "AttributeId">;

export function AttributeId(attributeId: number, validate = true): AttributeId {
    if (!validate) {
        return attributeId as AttributeId;
    }
    if (attributeId >= 0xf000 && attributeId <= 0xfffe) {
        return attributeId as AttributeId;
    }
    const { typeSuffix } = fromMEI(attributeId);
    if (typeSuffix >= 0x0000 && typeSuffix <= 0x4fff) {
        return attributeId as AttributeId;
    }
    throw new ValidationOutOfBoundsError(`Invalid attribute ID: ${attributeId}`);
}

export namespace AttributeId {
    export const isGlobal = (attributeId: AttributeId | number): boolean => {
        return attributeId >= 0xf000 && attributeId <= 0xfffe;
    };

    export const isValid = (attributeId: number): attributeId is AttributeId => {
        return tryCatch(
            () => {
                AttributeId(attributeId);
                return true;
            },
            ValidationError,
            false,
        );
    };
}

/** Tlv schema for an Attribute Id. */
export const TlvAttributeId = new TlvWrapper<AttributeId, number>(
    TlvUInt32,
    attributeId => attributeId,
    value => AttributeId(value, false), // No automatic validation on decode
);
