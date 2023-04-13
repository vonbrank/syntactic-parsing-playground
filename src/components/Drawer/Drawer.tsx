import React from "react";
import {
    Box,
    Drawer,
    DrawerProps,
    List,
    Toolbar,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import LaunchIcon from "@mui/icons-material/Launch";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";

interface SideMenuItemData {
    label: string;
    icon: JSX.Element;
}

const sideMenuList: (SideMenuItemData | "Divider")[] = [
    {
        label: "清屏",
        icon: <ClearIcon />
    },
    {
        label: "打开",
        icon: <LaunchIcon />
    },
    {
        label: "保存",
        icon: <SaveIcon />
    },
    "Divider",
    {
        label: "设置",
        icon: <SettingsIcon />
    },
    {
        label: "关于",
        icon: <InfoIcon />
    }
];

interface AppSideBarDrawerProps extends DrawerProps {}

export const AppSideBarDrawer = (props: AppSideBarDrawerProps) => {
    const { anchor = "left", ...others } = props;

    return (
        <Drawer anchor={anchor} {...others}>
            <Toolbar />
            <Box width={"32rem"}>
                <List>
                    {sideMenuList.map((sideMenuItem, index) => {
                        if (sideMenuItem === "Divider") {
                            return <Divider key={index} />;
                        } else {
                            return (
                                <ListItem key={index}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            {sideMenuItem.icon}
                                        </ListItemIcon>
                                        <ListItemText>
                                            {sideMenuItem.label}
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            );
                        }
                    })}
                </List>
            </Box>
        </Drawer>
    );
};
