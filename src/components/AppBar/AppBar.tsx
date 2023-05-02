import React from "react";
import {
    Stack,
    Toolbar,
    AppBar,
    Typography,
    IconButton,
    AppBarProps,
    Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";

interface DefaultAppBarProps extends AppBarProps {
    onMenuButtonClick?: () => void;
    appBarTitle?: React.ReactNode;
    menuItems?: React.ReactNode;
}

const DefaultAppBar = (props: DefaultAppBarProps) => {
    const {
        onMenuButtonClick = () => {},
        appBarTitle = (
            <Typography
                variant="h6"
                sx={{
                    textAlign: "center",
                    letterSpacing: "0.1rem"
                }}>
                Syntactic Parsing Playground
            </Typography>
        ),
        menuItems = <></>,
        ...others
    } = props;

    return (
        <AppBar {...others}>
            <Toolbar>
                <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                    }}>
                    {appBarTitle}
                </Stack>
                <Stack
                    direction={"row"}
                    justifyContent="space-between"
                    width={"100%"}>
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={() => onMenuButtonClick()}>
                        <MenuIcon />
                    </IconButton>
                    <Stack direction={"row"}>
                        <IconButton
                            size="large"
                            color="inherit"
                            onClick={() => {
                                window.open(
                                    "https://github.com/vonbrank/syntactic-parsing-playground",
                                    "_blank"
                                );
                            }}>
                            <GitHubIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default DefaultAppBar;
