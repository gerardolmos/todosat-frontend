/*
 * La tienda es una funcionalidad futura.
 *
 * Fail-closed:
 * solo se habilita cuando la variable vale exactamente "true".
 */
export const STORE_ENABLED =
    import.meta.env.PUBLIC_STORE_ENABLED === "true";
