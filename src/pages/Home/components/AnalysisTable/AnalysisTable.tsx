import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {
    TableCellPropsVariantOverrides
} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import { actionSize, gotoSize, tableData } from "./AnalysisTableData";
import { ReactElement, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { LR0Automaton } from "../../../../modules/automatons/lr0/LR0";
import useMediaQuery from "@mui/material/useMediaQuery";

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
) {
    return { name, calories, fat, carbs, protein };
}

interface TableDataItem {
    action: {
        [index: string]: string;
    };
    goto: {
        [index: string]: string;
    };
}

interface TableData {
    items: TableDataItem[];
    actionSize: number;
    gotoSize: number;
}

interface AnalysisTableProps {
    automaton: LR0Automaton | null;
}

const tableDataPlaceHolder: TableData = {
    items: [
        {
            action: { $: "" },
            goto: { "": "" }
        }
    ],
    actionSize: 1,
    gotoSize: 1
};

const AnalysisTable = function (props: AnalysisTableProps) {
    const { automaton } = props;

    const [tableData, setTableData] = useState<TableData | null>(null);

    useEffect(() => {
        if (automaton === null) {
            setTableData(null);
            return;
        }
        const { states, standardGrammar, endId } = automaton;
        const { terminals, nonTerminals, startCharacter } = standardGrammar;
        // console.log("automaton", automaton);

        const tableDataItems: TableDataItem[] = states.map(state => {
            const action: {
                [index: string]: string;
            } = {};
            const goto: {
                [index: string]: string;
            } = {};

            const endCharActionStr: string[] = [];

            terminals.forEach(terminal => {
                const actionStr: string[] = [];
                state.targets.forEach(target => {
                    const symbol =
                        target.transferSymbols.find(
                            transferSymbol => transferSymbol === terminal
                        ) || null;
                    if (symbol !== null) actionStr.push(`s${target.id}`);
                });

                state.itemSet.forEach(item => {
                    if (item.leftSide === startCharacter) return;

                    if (item.dotPos === item.rightSide.length) {
                        const productionIndex =
                            standardGrammar.productions.findIndex(
                                production => {
                                    const productionRightSide =
                                        production.rightSide;
                                    const itemRightSide = item.rightSide;

                                    if (
                                        productionRightSide.length !==
                                        itemRightSide.length
                                    )
                                        return false;
                                    for (
                                        let i = 0;
                                        i < productionRightSide.length;
                                        i++
                                    ) {
                                        if (
                                            productionRightSide[i] !==
                                            itemRightSide[i]
                                        )
                                            return false;
                                    }
                                    return true;
                                }
                            );
                        if (productionIndex !== -1) {
                            actionStr.push(`r${productionIndex}`);
                            if (
                                endCharActionStr.findIndex(
                                    item => item === `r${productionIndex}`
                                ) === -1
                            )
                                endCharActionStr.push(`r${productionIndex}`);
                        }
                    }
                });
                action[terminal] = actionStr.join("/");
            });

            if (state.id === endId) {
                action["$"] = "acc";
            } else {
                action["$"] = endCharActionStr.join("/");
            }

            nonTerminals.forEach(nonTerminal => {
                if (nonTerminal === startCharacter) return;

                const actionStr: string[] = [];
                state.targets.forEach(target => {
                    const symbol =
                        target.transferSymbols.find(
                            transferSymbol => transferSymbol === nonTerminal
                        ) || null;
                    if (symbol !== null) actionStr.push(`${target.id}`);
                });
                goto[nonTerminal] = actionStr.join("/");
            });

            return {
                action: action,
                goto: goto
            };
        });

        setTableData({
            items: tableDataItems,
            actionSize: terminals.length,
            gotoSize: nonTerminals.length
        });
    }, [automaton]);

    const headCells: Array<ReactElement> = [];

    Object.entries((tableData || tableDataPlaceHolder).items[0].action).forEach(
        entry => {
            headCells.push(
                <TableCell align="center">
                    <Typography>{entry[0]}</Typography>
                </TableCell>
            );
        }
    );
    Object.entries((tableData || tableDataPlaceHolder).items[0].goto).forEach(
        entry => {
            headCells.push(
                <TableCell align="center">
                    <Typography>{entry[0]}</Typography>
                </TableCell>
            );
        }
    );

    const bodyRow: React.ReactNode[] = [];
    (tableData || tableDataPlaceHolder).items.forEach((stateRow, index) => {
        const cells: Array<ReactElement> = [];
        Object.entries(stateRow.action).forEach((entry, index) => {
            cells.push(
                <TableCell align="center">
                    <Typography>{entry[1]}</Typography>
                </TableCell>
            );
        });
        Object.entries(stateRow.goto).forEach(entry => {
            cells.push(
                <TableCell align="center">
                    <Typography>{entry[1]}</Typography>
                </TableCell>
            );
        });
        bodyRow.push(
            <>
                <TableRow
                    key={index}
                    sx={{
                        "&:last-child td, &:last-child th": {
                            border: 0
                        }
                    }}>
                    <TableCell align="center">
                        <Typography>{index}</Typography>
                    </TableCell>
                    {...cells}
                </TableRow>
            </>
        );
    });

    const minWidth900px = useMediaQuery("(min-width:900px)");

    return (
        <>
            {minWidth900px && (
                <Box padding="2.4rem">
                    <Typography textAlign="center">LR 分析表</Typography>
                </Box>
            )}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: "40rem" }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="center"
                                rowSpan={2}
                                sx={{
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 3,
                                    borderRight:
                                        "1px solid rgba(224, 224, 224, 1)"
                                }}>
                                <Typography>状态</Typography>
                            </TableCell>
                            <TableCell
                                align="center"
                                colSpan={
                                    (tableData || tableDataPlaceHolder)
                                        .actionSize
                                }>
                                <Typography>ACTION</Typography>
                            </TableCell>
                            <TableCell
                                align="center"
                                colSpan={
                                    (tableData || tableDataPlaceHolder).gotoSize
                                }>
                                <Typography>GOTO</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                "& .MuiTableCell-root": {
                                    top: "calc(2.4rem + 32px + 1px)"
                                }
                            }}>
                            {tableData && (
                                <>
                                    {Object.entries(
                                        tableData.items[0].action
                                    ).map(entry => (
                                        <TableCell
                                            key={entry[0]}
                                            align="center">
                                            <Typography>{entry[0]}</Typography>
                                        </TableCell>
                                    ))}
                                    {Object.entries(
                                        tableData.items[0].goto
                                    ).map(entry => (
                                        <TableCell
                                            key={entry[0]}
                                            align="center">
                                            <Typography>{entry[0]}</Typography>
                                        </TableCell>
                                    ))}
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            "& .MuiTableRow-root .MuiTableCell-root:first-of-type":
                                {
                                    position: "sticky",
                                    left: 0,
                                    backgroundColor: theme =>
                                        theme.palette.common.white,
                                    borderRight:
                                        "1px solid rgba(224, 224, 224, 1)"
                                }
                        }}>
                        {tableData ? (
                            <>
                                {tableData.items.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0
                                                }
                                        }}>
                                        <TableCell align="center">
                                            <Typography>{index}</Typography>
                                        </TableCell>
                                        {Object.entries(item.action).map(
                                            entry => (
                                                <TableCell
                                                    key={entry[0]}
                                                    align="center">
                                                    <Typography>
                                                        {entry[1]}
                                                    </Typography>
                                                </TableCell>
                                            )
                                        )}
                                        {Object.entries(item.goto).map(
                                            entry => (
                                                <TableCell
                                                    key={entry[0]}
                                                    align="center">
                                                    <Typography>
                                                        {entry[1]}
                                                    </Typography>
                                                </TableCell>
                                            )
                                        )}
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <TableRow>
                                <TableCell align="center" colSpan={3}>
                                    <Typography>{"暂无数据"}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default AnalysisTable;
