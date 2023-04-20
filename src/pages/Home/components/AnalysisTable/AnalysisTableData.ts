// 临时状态表 Proposal
export const tableData = [
    {
        action: { a: "s3", b: "s4", end: "" },
        goto: { S: "1", B: "2" }
    },
    {
        action: { a: "", b: "", end: "acc" },
        goto: { S: "", B: "" }
    },
    {
        action: { a: "s3", b: "s4", end: "" },
        goto: { S: "", B: "5" }
    },
    {
        action: { a: "s3", b: "s4", end: "" },
        goto: { S: "", B: "6" }
    },
    {
        action: { a: "r3", b: "r3", end: "r3" },
        goto: { S: "", B: "" }
    },
    {
        action: { a: "r1", b: "r1", end: "r1" },
        goto: { S: "", B: "" }
    },
    {
        action: { a: "r2", b: "r2", end: "r2" },
        goto: { S: "", B: "" }
    }
];

export const actionSize = Object.entries(tableData[0].action).length;
export const gotoSize = Object.entries(tableData[0].goto).length;
