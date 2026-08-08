import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnv } from "vite";

const fileEnv = loadEnv(
    process.env.NODE_ENV ?? "production",
    process.cwd(),
    "",
);

const storeEnabled =
    (process.env.PUBLIC_STORE_ENABLED ??
        fileEnv.PUBLIC_STORE_ENABLED) === "true";

if (!storeEnabled) {
    const storeDir = resolve("dist", "tienda");

    await rm(storeDir, {
        recursive: true,
        force: true,
    });

    console.log(
        "[postbuild] Tienda desactivada: dist/tienda eliminado.",
    );
}
