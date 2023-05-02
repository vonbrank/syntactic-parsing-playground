function saveSingle(text: string, fileName: string, mimeType: string) {
    const stringUrl = URL.createObjectURL(new Blob([text], { type: mimeType }));

    const anchor = document.createElement("a");
    anchor.href = stringUrl;
    anchor.download = fileName;

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(stringUrl);
}

export function saveSingleJson<T = {}>(obj: T, fileName: string) {
    saveSingle(JSON.stringify(obj), fileName, "application/json");
}
