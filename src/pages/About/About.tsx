import React from "react";
import {
    Box,
    Dialog,
    DialogProps,
    Stack,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import Typography from "@mui/material/Typography";

interface AboutProps extends DialogProps {}

const About = (props: AboutProps) => {
    const { onClose, ...others } = props;

    return (
        <Dialog onClose={onClose} {...others}>
            <DialogTitle fontWeight={"600"}>关于</DialogTitle>
            <DialogContent>
                <Typography
                    fontSize={"2rem"}
                    textAlign="center"
                    marginBottom={"1.6rem"}
                    fontWeight="600">
                    语法分析可视化 | Syntactic Parsing Playground
                </Typography>

                <Stack spacing="1.2rem">
                    <Box>
                        <Typography
                            fontSize={"1.8rem"}
                            fontWeight="600"
                            textAlign={"center"}>
                            作者
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            "& .MuiTypography-root": {
                                fontSize: "1.6rem",
                                textAlign: "center"
                            }
                        }}>
                        <Typography>哈尔滨工业大学 - Von Brank</Typography>
                        <Typography>哈尔滨工业大学 - Ernest Cui</Typography>
                        <Typography>哈尔滨工业大学（深圳） - Yukko</Typography>
                    </Box>
                    <Box>
                        <Typography fontSize={"1.8rem"} textAlign={"center"}>
                            May, 2023
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ paddingX: "2.4rem", paddingBottom: "1.6rem" }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (onClose) {
                            onClose({}, "escapeKeyDown");
                        }
                    }}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default About;
