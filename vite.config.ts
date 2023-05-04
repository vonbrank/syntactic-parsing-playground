import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "url";
import { getBaseUrlByDeployPlatform } from "./config";

const DEPLOY_PLATFORM: string | null = process.env.DEPLOY_PLATFORM || null;
const baseUrl = getBaseUrlByDeployPlatform(DEPLOY_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig({
    base: baseUrl,
    server: {
        host: true
    },
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: fileURLToPath(new URL("./src", import.meta.url))
            }
        ]
    }
});
