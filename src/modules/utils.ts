export function splitLines(x: string): string[] {
    return x.replace(/\r/g, "").split("\n");
}
