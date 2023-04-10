import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    alpha,
    Tabs,
    Tab
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { SvgIconComponent } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import LaunchIcon from "@mui/icons-material/Launch";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import InfoIcon from "@mui/icons-material/Info";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import CloseIcon from "@mui/icons-material/Close";

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

type SyntaxType = "LR0" | "LR1" | "SLR" | "LALR" | "LL";
const syntaxTypeList: SyntaxType[] = ["LR0", "SLR", "LR1", "LALR", "LL"];

const Home = () => {
    const [drawOpen, setDrawOpen] = useState(false);

    const [syntaxType, setSyntaxType] = useState<SyntaxType | "None">("LR0");
    const handleChangeSyntaxType = (newType: SyntaxType) => {
        setSyntaxType(current => {
            if (current === newType) return "None";
            return newType;
        });
    };

    const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);

    return (
        <Stack height="100vh">
            <AppBar sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Stack
                        justifyContent={"center"}
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%"
                        }}>
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                letterSpacing: "0.1rem"
                            }}>
                            Syntactic Parsing Playground
                        </Typography>
                    </Stack>
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={() => setDrawOpen(current => !current)}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box sx={{ flex: 1 }}>
                <Drawer
                    anchor="left"
                    open={drawOpen}
                    onClose={() => setDrawOpen(false)}>
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
                <Drawer
                    PaperProps={{
                        sx: {
                            zIndex: theme => theme.zIndex.drawer - 1
                        }
                    }}
                    variant="permanent">
                    <Toolbar />
                    <Stack
                        direction={"row"}
                        alignItems="stretch"
                        sx={{ flex: 1 }}>
                        <Stack
                            sx={{ boxShadow: 4 }}
                            justifyContent="space-between">
                            <ToggleButtonGroup
                                orientation="vertical"
                                exclusive
                                value={syntaxType}
                                onChange={(e, newType) =>
                                    handleChangeSyntaxType(newType)
                                }>
                                {syntaxTypeList.map(syntaxTypeItem => (
                                    <ToggleButton
                                        sx={{
                                            height: "7.2rem",
                                            width: "7.2rem",
                                            border: "none",
                                            "&.Mui-selected": {
                                                backgroundColor: "transparent",
                                                color: theme =>
                                                    theme.palette.primary.main,
                                                "&:hover": {
                                                    backgroundColor: theme =>
                                                        alpha(
                                                            theme.palette
                                                                .primary.main,
                                                            0.1
                                                        )
                                                }
                                            }
                                        }}
                                        value={syntaxTypeItem}>
                                        <Typography>
                                            {syntaxTypeItem}
                                        </Typography>
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                            <Stack alignItems={"center"}>
                                <IconButton
                                    onClick={() =>
                                        setBottomDrawerOpen(current => !current)
                                    }
                                    sx={{ height: "3.6rem", width: "3.6rem" }}>
                                    <KeyboardIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                        <Stack maxWidth={"32rem"}>
                            <Box width={"32rem"} sx={{ flex: 1 }}>
                                <Stack
                                    height={"100%"}
                                    alignItems={"center"}
                                    justifyContent="center">
                                    <Typography>文法输入区域占位符</Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Drawer>
                <Drawer
                    PaperProps={{
                        sx: {
                            zIndex: theme => theme.zIndex.drawer - 1
                        }
                    }}
                    anchor="right"
                    variant="permanent">
                    <Toolbar />
                    <Stack
                        sx={{ flex: 1 }}
                        width="32rem"
                        alignItems={"center"}
                        justifyContent="center">
                        <Typography>分析表显示区域占位符</Typography>
                    </Stack>
                </Drawer>
                <Drawer
                    anchor="bottom"
                    variant="persistent"
                    open={bottomDrawerOpen}>
                    <Stack
                        height={"24rem"}
                        sx={{ position: "relative" }}
                        alignItems={"center"}
                        justifyContent="center">
                        <IconButton
                            onClick={() => setBottomDrawerOpen(false)}
                            sx={{ position: "absolute", top: 0, right: 0 }}>
                            <CloseIcon />
                        </IconButton>
                        <Typography>输入句子与分析格局区域占位符</Typography>
                    </Stack>
                </Drawer>
            </Box>
        </Stack>
    );
};

export default Home;
