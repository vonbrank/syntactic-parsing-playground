function loadSingleText(accept: string, onload: (text: string) => void) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => {
        if (input.files === null || input.files.length === 0) {
            return;
        }

        const fileReader = new FileReader();

        fileReader.readAsText(input.files[0]);

        fileReader.onload = () => onload(fileReader.result as string);

        input.value = "";
    };

    input.click();

    input.remove();
}

export function loadSingleJson(
    onload: (obj: {}) => void,
    onerror: (message: string) => void
) {
    loadSingleText(".json,application/json", text => {
        try {
            onload(JSON.parse(text));
        } catch (e: any) {
            onerror(e.message);
        }
    });
}
