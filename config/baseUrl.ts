export const getBaseUrlByDeployPlatform = (deployPlatform: string | null) => {
    let baseUrl = "/";

    const deployPlatformNotNull = (deployPlatform?.toLowerCase() || "").trim();

    switch (deployPlatformNotNull) {
        case "github":
            baseUrl = "/";
            break;
        case "gitee":
            baseUrl = "/syntactic-parsing-playground";
            break;
        default:
    }

    return baseUrl;
};

export const getBaseUrlByHostname = (hostname: string) => {
    let baseUrl = "/";

    if (
        hostname === "blog.vonbrank.com" ||
        hostname.endsWith("github.io") ||
        hostname.endsWith("gitee.io")
    ) {
        baseUrl = "/syntactic-parsing-playground";
    }

    return baseUrl;
};
