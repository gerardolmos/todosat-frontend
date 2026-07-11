// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const SITE_URL = "https://todosatcom.com";

function includeInSitemap(page) {
    const pathname = new URL(page).pathname.replace(/\/+$/, "") || "/";

    const excludedExactPaths = new Set([
        "/404",
        "/buscar",
        "/aviso-legal",
        "/privacidad",
        "/cookies",
        "/contacto",
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
