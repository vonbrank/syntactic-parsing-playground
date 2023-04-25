import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {
    TableCellPropsVariantOverrides
} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { actionSize, gotoSize, tableData } from "./AnalysisTableData";
import { ReactElement } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
) {
    return { name, calories, fat, carbs, protein };
}

interface AnalysisTableProps {}

const AnalysisTable = function (props: AnalysisTableProps) {
    const headCells: Array<ReactElement> = [];

    Object.entries(tableData[0].action).forEach(entry => {
        headCells.push(
            <TableCell align="center">
                <Typography>{entry[0]}</Typography>
            </TableCell>
        );
    });
    Object.entries(tableData[0].goto).forEach(entry => {
        headCells.push(
            <TableCell align="center">
                <Typography>{entry[0]}</Typography>
            </TableCell>
        );
    });

    const bodyRow: Array<ReactElement> = [];
    tableData.forEach((stateRow, index) => {
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

    return (
        <>
            <Box padding="2.4rem">
                <Typography textAlign="center">LR 分析表</Typography>
            </Box>
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
                            <TableCell align="center" colSpan={actionSize}>
                                <Typography>ACTION</Typography>
                            </TableCell>
                            <TableCell align="center" colSpan={gotoSize}>
                                <Typography>GOTO</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                "& .MuiTableCell-root": {
                                    top: "calc(2.4rem + 32px + 1px)"
                                }
                            }}>
                            {...headCells}
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
                        {...bodyRow}
                        {...bodyRow}
                        {...bodyRow}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default AnalysisTable;
