import { Box, Stack, StackProps } from "@mui/material";
import React, { useState } from "react";
import DefaultAppBar from "../AppBar/AppBar";
import { AppSideBarDrawer } from "../Drawer";

interface DefaultAppContainerProps extends StackProps {}

export const DefaultAppContainer = (props: DefaultAppContainerProps) => {
    const { children, ...others } = props;

    const [drawOpen, setDrawOpen] = useState(false);
    return (
        <Stack minHeight="100vh" {...others}>
            <DefaultAppBar
                sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
                onMenuButtonClick={() => setDrawOpen(current => !current)}
            />
            <Stack sx={{ flex: 1 }}>
                <AppSideBarDrawer
                    open={drawOpen}
                    onClose={() => setDrawOpen(false)}
                />
                {children}
            </Stack>
        </Stack>
    );
};
