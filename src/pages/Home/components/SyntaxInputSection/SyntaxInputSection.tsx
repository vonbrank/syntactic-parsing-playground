import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Collapse,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    TextFieldProps,
    Typography,
    alpha,
    Divider
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ClearIcon from "@mui/icons-material/Clear";
import { AnalyseLR0Grammar } from "../../../../modules/automatons/lr0/LR0";
import {
    LR0Grammar,
    LR0Production
} from "../../../../modules/automatons/lr0/LR0";

const exampleGrammar1: LR0Grammar = {
    productions: [
        {
            leftSide: "expr",
            rightSide: ["expr + term", "expr - term", "term"]
        },
        {
            leftSide: "term",
            rightSide: ["term * factor", "term - factor", "factor"]
        },
        {
            leftSide: "factor",
            rightSide: ["( expr )", "num"]
        }
    ]
};
const exampleGrammar2: LR0Grammar = {
    productions: [
        {
            leftSide: "S",
            rightSide: ["B B"]
        },
        {
            leftSide: "B",
            rightSide: ["a B"]
        },
        {
            leftSide: "B",
            rightSide: ["b"]
        }
    ]
};

const SyntaxInputSection = () => {
    const [grammar, setGrammar] = useState<LR0Grammar>(exampleGrammar2);

    const handleChangeProduction = (
        newProduction: LR0Production,
        newIndex: number
    ) => {
        setGrammar(current => {
            const newProductions = current.productions.map(
                (production, index) => {
                    if (index === newIndex) return newProduction;
                    return production;
                }
            );
            return {
                ...current,
                productions: newProductions
            };
        });
    };

    const handleAddProduction = () => {
        setGrammar(current => {
            return {
                ...current,
                productions: [
                    ...current.productions,
                    {
                        leftSide: "",
                        rightSide: [""]
                    }
                ]
            };
        });
    };

    const handleDeleteProduction = (deleteIndex: number) => {
        setGrammar(current => {
            return {
                ...current,
                productions: current.productions.filter(
                    (_, index) => index !== deleteIndex
                )
            };
        });
    };

    const handleAnalyse = () => {
        AnalyseLR0Grammar(grammar);
    };

    return (
        <>
            <Box padding="2.4rem" sx={{ width: "100%", flex: 1 }}>
                <Typography textAlign="center" marginBottom="2.4rem">
                    在此输入文法
                </Typography>
                <Stack>
                    <Stack spacing={"2rem"}>
                        {grammar.productions.map((item, index) => (
                            <>
                                <ProducerBlock
                                    key={index}
                                    production={item}
                                    onChangeProduction={newProduction =>
                                        handleChangeProduction(
                                            newProduction,
                                            index
                                        )
                                    }
                                    onDeleteProduction={() =>
                                        handleDeleteProduction(index)
                                    }
                                />
                                <Divider />
                            </>
                        ))}
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleAddProduction}>
                            +
                        </Button>
                    </Stack>
                </Stack>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: theme => theme.palette.common.white,
                    padding: "1.2rem 2.4rem",
                    boxShadow: theme =>
                        `0 1.2rem 2.4rem ${alpha(
                            theme.palette.common.black,
                            0.5
                        )}`,
                    zIndex: theme => theme.zIndex.drawer - 3
                }}>
                <Stack direction="row" justifyContent="end">
                    <Button variant="contained" onClick={handleAnalyse}>
                        分析
                    </Button>
                </Stack>
            </Box>
        </>
    );
};

interface ProducerBlockProps {
    production: LR0Production;
    onChangeProduction: (newProduction: LR0Production) => void;
    onDeleteProduction: () => void;
}

const ProducerBlock = (props: ProducerBlockProps) => {
    const { production, onChangeProduction, onDeleteProduction } = props;
    const { leftSide, rightSide } = production;

    const [blockFocus, setBlockFocus] = useState(false);
    // const [producerRightSides, setProducerRightSides] = useState([""]);

    const handleChangeRightSide = (newRightside: string[]) => {
        onChangeProduction({
            ...production,
            rightSide: newRightside
        });
    };

    const handleChangeProducerRightSidesValue = (
        newValue: string,
        newValueIndex: number
    ) => {
        const newRightSide = rightSide.map((item, index) => {
            if (index === newValueIndex) {
                return newValue;
            } else return item;
        });
        handleChangeRightSide(newRightSide);
    };

    const handleAddRightSide = () => {
        const newRightSide = [...rightSide, ""];
        handleChangeRightSide(newRightSide);
    };
    const handleRemoveRightSide = (itemIndex: number) => {
        const newRightSide = rightSide.filter(
            (item, index) => index !== itemIndex
        );
        handleChangeRightSide(newRightSide);
    };

    const handleChangeLeftSide = (newLeftSide: string) => {
        onChangeProduction({
            ...production,
            leftSide: newLeftSide
        });
    };

    return (
        <Box
            tabIndex={0}
            onFocus={() => setBlockFocus(true)}
            onBlur={() => setBlockFocus(false)}
            sx={{
                position: "relative",
                ":focus": {
                    outline: "none"
                }
            }}>
            <Stack>
                <Stack>
                    <Stack spacing={"0.8rem"}>
                        <Stack alignItems="center" direction="row">
                            <Box sx={{ flex: 1, width: 0 }}>
                                <SyntaxInputTextField
                                    value={leftSide}
                                    onChange={e =>
                                        handleChangeLeftSide(e.target.value)
                                    }
                                />
                            </Box>
                            <Stack
                                sx={{ flex: 1, width: 0 }}
                                alignItems="center">
                                <ArrowDownwardIcon />
                            </Stack>
                        </Stack>
                        {rightSide.map((producerRightSide, index) => (
                            <SyntaxInputTextField
                                key={index}
                                value={producerRightSide}
                                onChange={e =>
                                    handleChangeProducerRightSidesValue(
                                        e.target.value,
                                        index
                                    )
                                }
                                InputProps={{
                                    endAdornment:
                                        index !== 0 ? (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() =>
                                                        handleRemoveRightSide(
                                                            index
                                                        )
                                                    }>
                                                    <ClearIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : undefined
                                }}
                            />
                        ))}
                    </Stack>
                    <Collapse in={blockFocus}>
                        <Box sx={{ paddingTop: "0.8rem" }}>
                            <Button
                                onClick={handleAddRightSide}
                                sx={{ padding: 0 }}
                                fullWidth
                                variant="contained">
                                +
                            </Button>
                        </Box>
                    </Collapse>
                </Stack>
            </Stack>
            <IconButton
                onClick={onDeleteProduction}
                sx={{
                    position: "absolute",
                    top: "-1.8rem",
                    right: 0,
                    padding: 0
                }}>
                <ClearIcon />
            </IconButton>
        </Box>
    );
};

type SyntaxInputTextFieldProps = TextFieldProps;

const SyntaxInputTextField = styled(TextField)<SyntaxInputTextFieldProps>(
    ({ theme }) => ({
        "& .MuiInputBase-input": {
            padding: "0.4rem 0.8rem",
            fontFamily: "consolas, monospace"
        },
        "& .MuiInputBase-root": {
            paddingRight: 0
        },
        "& .MuiInputAdornment-positionEnd": {
            margin: 0,
            "& .MuiIconButton-root": {
                padding: "0.4rem"
            },
            "& .MuiSvgIcon-root": {
                height: "1.6rem",
                width: "1.6rem"
            }
        }
    })
);

export default SyntaxInputSection;
