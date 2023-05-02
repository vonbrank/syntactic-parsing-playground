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
    Divider,
    Stepper,
    Step,
    StepLabel,
    StackProps
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ClearIcon from "@mui/icons-material/Clear";
import {
    AnalyseLR0Grammar,
    LR0Automaton
} from "../../../../modules/automatons/lr0/LR0";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
    LR0RawGrammar,
    LR0Production
} from "../../../../modules/automatons/lr0/LR0";
import {
    disposeAutomaton,
    generateAutomaton
} from "@/store/reducers/automaton";
import { TransitionGroup } from "react-transition-group";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { checkRawGrammar } from "../../../../modules/automatons/lr0/LR0";
import {
    LR0StandardGrammar,
    GrammarCheckResult
} from "../../../../modules/automatons/lr0/LR0";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Alert from "@mui/material/Alert";

const exampleGrammar1: LR0RawGrammar = {
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
const exampleGrammar2: LR0RawGrammar = {
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
const exampleGrammar3: LR0RawGrammar = {
    productions: [
        {
            leftSide: "E",
            rightSide: ["E + T", "T"]
        },
        {
            leftSide: "T",
            rightSide: ["T * F", "F"]
        },
        {
            leftSide: "F",
            rightSide: ["( E )", "id"]
        }
    ]
};

const steps = ["输入", "检查", "运行"];

interface StandardGrammarBlockProps extends StackProps {
    label: string;
}

const StandardGrammarBlock = (props: StandardGrammarBlockProps) => {
    const { label, children, direction = "row", ...others } = props;
    return (
        <Stack direction={direction} {...others}>
            <Box width={"9.6rem"} sx={{ flexShrink: 0 }}>
                <Typography>{label}: </Typography>
            </Box>
            <Box>{children}</Box>
        </Stack>
    );
};

const SyntaxInputSection = () => {
    const disptach = useAppDispatch();
    const { automaton } = useAppSelector(state => ({
        automaton: state.automaton.automaton
    }));

    const [grammar, setGrammar] = useState<LR0RawGrammar>(exampleGrammar2);

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

    const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);

    const getStepContent = (
        stepIndex: number,
        checkRes: GrammarCheckResult | null,
        automaton: LR0Automaton | null
    ) => {
        const renderStandardGrammar = (standardGrammar: LR0StandardGrammar) => {
            return (
                <Stack>
                    {standardGrammar.productions.map((production, index) => {
                        return (
                            <Stack direction={"row"} key={index}>
                                <Typography className="Grammar-Symbol">{`(${index}) ${
                                    production.leftSide
                                } ➜  ${production.rightSide.join(
                                    " "
                                )}`}</Typography>
                            </Stack>
                        );
                    })}
                </Stack>
            );
        };

        switch (stepIndex) {
            case 0:
                return (
                    <>
                        <Typography textAlign="center" marginY="2.4rem">
                            请在此输入文法
                        </Typography>
                        <Stack>
                            <Stack
                                sx={{
                                    "& .SyntaxInputSection-transition-group": {
                                        "& .SyntaxInputSection-transition-group-collapse-root:not(:first-of-type) .ProducerBlock-root":
                                            {
                                                marginTop: "2rem"
                                            },
                                        "& .SyntaxInputSection-transition-group-collapse-root:not(:last-of-type) .ProducerBlock-root":
                                            {
                                                marginBottom: "2rem"
                                            }
                                    }
                                }}
                                spacing="2rem">
                                <TransitionGroup className="SyntaxInputSection-transition-group">
                                    {grammar.productions.map((item, index) => (
                                        <Collapse
                                            key={index}
                                            className="SyntaxInputSection-transition-group-collapse-root">
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
                                                    handleDeleteProduction(
                                                        index
                                                    )
                                                }
                                            />
                                            <Divider />
                                        </Collapse>
                                    ))}
                                </TransitionGroup>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleAddProduction}>
                                    +
                                </Button>
                            </Stack>
                        </Stack>
                    </>
                );
                break;
            case 1:
                return (
                    <>
                        <Typography textAlign="center" marginY="2.4rem">
                            已将您输入的文法转化为增广文法，请检查是否正确
                        </Typography>
                        <Stack spacing={"1.2rem"}>
                            {checkRes && (
                                <>
                                    <StandardGrammarBlock label="非终结符">
                                        <Typography className="Grammar-Symbol">
                                            {checkRes.standardGrammar.nonTerminals.join(
                                                ", "
                                            )}
                                        </Typography>
                                    </StandardGrammarBlock>
                                    <StandardGrammarBlock label="终结符">
                                        <Typography className="Grammar-Symbol">
                                            {checkRes.standardGrammar.terminals.join(
                                                ", "
                                            )}
                                        </Typography>
                                    </StandardGrammarBlock>
                                    <StandardGrammarBlock
                                        label="产生式"
                                        direction={"column"}>
                                        {renderStandardGrammar(
                                            checkRes.standardGrammar
                                        )}
                                    </StandardGrammarBlock>
                                    <StandardGrammarBlock label="开始符号">
                                        <Typography className="Grammar-Symbol">
                                            {
                                                checkRes.standardGrammar
                                                    .startCharacter
                                            }
                                        </Typography>
                                    </StandardGrammarBlock>
                                </>
                            )}
                        </Stack>
                        {checkRes && (
                            <Stack marginTop={"1.2rem"}>
                                {checkRes.errorMessages.map(
                                    (errorMessage, index) => (
                                        <Alert severity="error">
                                            {errorMessage}
                                        </Alert>
                                    )
                                )}
                            </Stack>
                        )}
                    </>
                );
                break;
            case 2:
                return (
                    <>
                        <Typography textAlign="center" marginY="2.4rem">
                            单击左下角的 <KeyboardIcon />{" "}
                            按钮以输入句子，单击中间下方的 <PlayArrowIcon />{" "}
                            按钮开始分析
                        </Typography>
                        <Stack>
                            {automaton &&
                                renderStandardGrammar(
                                    automaton.standardGrammar
                                )}
                        </Stack>
                    </>
                );
                break;
            default:
                return <></>;
        }
    };

    const [checkRes, setCheckRes] = useState<GrammarCheckResult | null>(null);

    const handleBack = () => {
        setActiveStep(current => {
            if (current === 2) {
                disptach(disposeAutomaton());
            }

            if (current === 1) {
                setCheckRes(null);
            }

            if (current !== 0) {
                const res = (current - 1) as 0 | 1;
                return res;
            }
            return current;
        });
    };

    const handleNext = () => {
        setActiveStep(current => {
            if (current === 0) {
                const checkRes = checkRawGrammar(grammar);
                setCheckRes(checkRes);
            }

            if (current === 1) {
                disptach(generateAutomaton(grammar));
            }

            if (current !== 2) {
                const res = (current + 1) as 1 | 2;
                return res;
            }
            return current;
        });
    };

    return (
        <>
            <Box padding="2.4rem" sx={{ width: "100%", flex: 1 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <Box
                    sx={{
                        "& .MuiTypography-root": {
                            "&.Grammar-Symbol": {
                                fontFamily: `"Roboto Mono", monospace`
                            },
                            fontSize: "1.8rem"
                        }
                    }}>
                    {getStepContent(activeStep, checkRes, automaton)}
                </Box>
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
                <Stack direction="row" justifyContent="space-between">
                    <Box>
                        {activeStep !== 0 && (
                            <Button onClick={handleBack}>返回</Button>
                        )}
                    </Box>
                    <Box>
                        {activeStep !== 2 && (
                            <Button
                                onClick={handleNext}
                                disabled={
                                    activeStep === 1 &&
                                    (checkRes === null ||
                                        checkRes.errorMessages.length > 0)
                                }>
                                {activeStep === 0 ? "下一步" : "确认"}
                            </Button>
                        )}
                    </Box>
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
            className="ProducerBlock-root"
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
                    <Stack
                        spacing={"0.8rem"}
                        sx={{
                            "& .ProducerBlock-transition-group": {
                                "& .ProducerBlock-transition-group-collapse-root:not(:last-of-type) .MuiCollapse-wrapperInner":
                                    {
                                        marginBottom: "0.8rem"
                                    }
                            }
                        }}>
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
                        <TransitionGroup className="ProducerBlock-transition-group">
                            {rightSide.map((producerRightSide, index) => (
                                <Collapse
                                    key={index}
                                    className="ProducerBlock-transition-group-collapse-root">
                                    <SyntaxInputTextField
                                        fullWidth
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
                                </Collapse>
                            ))}
                        </TransitionGroup>
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
