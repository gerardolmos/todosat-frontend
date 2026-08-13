// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const SITE_URL = "https://todosatcom.com";

const fileEnv = loadEnv(
    process.env.NODE_ENV ?? "production",
    process.cwd(),
    "",
);

const STORE_ENABLED =
    (process.env.PUBLIC_STORE_ENABLED ??
        fileEnv.PUBLIC_STORE_ENABLED) === "true";

function includeInSitemap(page) {
    const pathname = new URL(page).pathname.replace(/\/+$/, "") || "/";

    if (
        !STORE_ENABLED &&
        (pathname === "/tienda" ||
            pathname.startsWith("/tienda/"))
    ) {
        return false;
    }

    const excludedExactPaths = new Set([
        "/404",
        "/buscar",
        "/aviso-legal",
        "/privacidad",
        "/cookies",
        "/contacto",
        "/tienda/carrito",
        "/tienda/compra/confirmacion",
        "/tienda/consulta-enviada",
        "/tienda/consultar-disponibilidad",
    ]);

    if (excludedExactPaths.has(pathname)) {
        return false;
    }

    const isOldestNewsOrder =
        /^\/noticias(?:\/[^/]+)?\/orden\/antiguos(?:\/\d+)?$/.test(
            pathname,
        );

    if (isOldestNewsOrder) {
        return false;
    }

    const isCombinedHardwareFilter =
        /^\/hardware\/tipo\/[^/]+\/operador\/[^/]+(?:\/\d+)?$/.test(
            pathname,
        );

    if (isCombinedHardwareFilter) {
        return false;
    }

    return true;
}

export default defineConfig({
    image: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
    site: SITE_URL,

    integrations: [
        sitemap({
            filter: includeInSitemap,
        }),
    ],

    prefetch: {
        prefetchAll: true,
        defaultStrategy: "hover",
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
