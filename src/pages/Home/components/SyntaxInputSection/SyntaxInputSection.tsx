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
    alpha
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ClearIcon from "@mui/icons-material/Clear";

const SyntaxInputSection = () => {
    return (
        <Box>
            <Box padding="2.4rem">
                <Typography textAlign="center" marginBottom="2.4rem">
                    在此输入文法
                </Typography>
                <Stack>
                    <Stack spacing={"2rem"}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                            <ProducerBlock key={item} />
                        ))}
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
                    <Button variant="contained">分析</Button>
                </Stack>
            </Box>
        </Box>
    );
};

const ProducerBlock = () => {
    const [blockFocus, setBlockFocus] = useState(false);
    const [producerRightSides, setProducerRightSides] = useState(["", ""]);
    const handleChangeProducerRightSidesValue = (
        newValue: string,
        newValueIndex: number
    ) => {
        setProducerRightSides(current =>
            current.map((item, index) => {
                if (index === newValueIndex) {
                    return newValue;
                } else return item;
            })
        );
    };

    const handleAddRightSide = () => {
        setProducerRightSides(current => [...current, ""]);
    };
    const handleRemoveRightSide = (itemIndex: number) => {
        setProducerRightSides(current =>
            current.filter((item, index) => index !== itemIndex)
        );
    };

    return (
        <div
            tabIndex={0}
            onFocus={() => setBlockFocus(true)}
            onBlur={() => setBlockFocus(false)}>
            <Stack direction="row">
                <Stack sx={{ flex: 2 }}>
                    <Stack alignItems="center" direction="row">
                        <SyntaxInputTextField />
                        <ArrowForwardIcon />
                    </Stack>
                </Stack>
                <Stack sx={{ flex: 4 }}>
                    <Stack spacing={"0.8rem"}>
                        {producerRightSides.map((producerRightSide, index) => (
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
        </div>
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
