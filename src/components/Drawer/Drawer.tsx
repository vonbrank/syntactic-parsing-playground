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
import { loadSingleJson } from "@/modules/fs/load";
import { saveSingleJson } from "@/modules/fs/save";

interface SideMenuItemData {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const sideMenuList: (SideMenuItemData | "Divider")[] = [
    {
        label: "清屏",
        icon: <ClearIcon />,
        onClick: () => {}
    },
    {
        label: "打开",
        icon: <LaunchIcon />,
        onClick: () => {
            loadSingleJson(
                obj => console.log("Successfully loaded JSON", obj),
                message => console.log("Error parsing JSON", message)
            );
        }
    },
    {
        label: "保存",
        icon: <SaveIcon />,
        onClick: () => {
            saveSingleJson<{ x: number }>({ x: 123 }, "demo.json");
        }
    },
    "Divider",
    {
        label: "设置",
        icon: <SettingsIcon />,
        onClick: () => {}
    },
    {
        label: "关于",
        icon: <InfoIcon />,
        onClick: () => {}
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
                                <ListItem
                                    key={index}
                                    onClick={sideMenuItem.onClick}>
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
