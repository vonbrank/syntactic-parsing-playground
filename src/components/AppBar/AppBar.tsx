import React from "react";
import {
    Stack,
    Toolbar,
    AppBar,
    Typography,
    IconButton,
    AppBarProps
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface DefaultAppBarProps extends AppBarProps {
    onMenuButtonClick?: () => void;
    appBarTitle?: React.ReactNode;
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
                <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => onMenuButtonClick()}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default DefaultAppBar;
