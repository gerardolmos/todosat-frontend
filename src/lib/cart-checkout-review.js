function assertArray(
    value,
    name,
) {
    if (!Array.isArray(value)) {
        throw new TypeError(
            `${name} debe ser un array.`,
        );
    }
}

export function reconcileCartWithValidation(
    localItems,
    validatedCart,
) {
    assertArray(
        localItems,
        "localItems",
    );

    if (
        !validatedCart ||
        typeof validatedCart !==
            "object" ||
        !Array.isArray(
            validatedCart.lineas,
        )
    ) {
        throw new TypeError(
            "validatedCart no es válido.",
        );
    }

    const validatedById =
        new Map(
            validatedCart.lineas.map(
                (line) => [
                    line.documentId,
                    line,
                ],
            ),
        );

    if (
        validatedById.size !==
        localItems.length
    ) {
        throw new TypeError(
            "La validación no coincide con el carrito.",
        );
    }

    const changes = [];

    const items =
        localItems.map((item) => {
            const line =
                validatedById.get(
                    item.documentId,
                );

            if (!line) {
                throw new TypeError(
                    "Falta un producto en la validación.",
                );
            }

            if (
                line.cantidad !==
                item.cantidad
            ) {
                throw new TypeError(
                    "La cantidad validada no coincide.",
                );
            }

            const fields = [];

            if (
                line.nombre !==
                item.nombre
            ) {
                fields.push("nombre");
            }

            if (
                line.sku !== item.sku
            ) {
                fields.push("sku");
            }

            if (
                line
                    .precioUnitarioCentimos !==
                item.precioCentimos
            ) {
                fields.push("precio");
            }

            if (
                line.requiereEnvio !==
                item.requiereEnvio
            ) {
                fields.push("envío");
            }

            if (fields.length > 0) {
                changes.push({
                    documentId:
                        item.documentId,
                    fields,
                });
            }

            return {
                ...item,
                nombre: line.nombre,
                sku: line.sku,
                precioCentimos:
                    line
                        .precioUnitarioCentimos,
                requiereEnvio:
                    line.requiereEnvio,
            };
        });

    return {
        changed:
            changes.length > 0,
        changes,
        items,
        subtotalCentimos:
            validatedCart
                .subtotalProductosCentimos,
        requiereEnvio:
            validatedCart
                .requiereEnvio,
    };
}
