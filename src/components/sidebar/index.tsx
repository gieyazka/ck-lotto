import * as React from "react";

import {
  Avatar,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuBook,
} from "@mui/icons-material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import i18n, { changeLanguage } from "i18next";

import Box from "@mui/material/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ColorModeContext } from "../../contexts/color-mode";
import CssBaseline from "@mui/material/CssBaseline";
import { DatePicker } from "@mui/x-date-pickers";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItems from "./menuItem";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: 900,
  maxHeight: "64px",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export default function Layout() {
  const { mode, setMode } = React.useContext(ColorModeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const splitPath = location.pathname ? location.pathname.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const user = JSON.parse(sessionStorage.getItem("User") || "null");
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        // position="sticky"
        elevation={1}
        //  open={open}
      >
        <Toolbar className="bg-white text-black dark:bg-[#1D336D] dark:text-white">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            // sx={{
            //   // marginRight: 5,
            //   ...(open && { display: "none" }),
            // }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div"> */}
          {/* </Typography> */}
          <Stack direction="row" width="100%" alignItems="center">
            <img src="/images/ck_group-removebg.png" className="h-12" />
            <Stack
              direction="row"
              width="100%"
              justifyContent="flex-end"
              alignItems="center"
              gap="16px"
            >
              <Button
                variant="contained"
                sx={{ color: "white", fontFamily: "BoonBaanRegular" }}
              >
                Report
              </Button>
              {/* <CustomInput /> */}
              <DatePicker
                format="DD/MM/YYYY"
                // value={filterStore.startDate || null}
                // label="Start date"
                slots={{
                  textField: CustomInput,
                }}
                onChange={(e: any) => {
                  if (e !== null) {
                    // filterStore.handleChangeStartDate(e);
                  }
                }}
              />
              <FormControl sx={{ minWidth: 64 }}>
                <Select
                  disableUnderline
                  defaultValue={i18n.language}
                  inputProps={{ "aria-label": "Without label" }}
                  variant="standard"
                  sx={{
                    color: "inherit",
                    "& .MuiSvgIcon-root": {
                      color: "inherit",
                    },
                    "& .MuiStack-root > .MuiTypography-root": {
                      display: {
                        xs: "none",
                        sm: "block",
                      },
                    },
                  }}
                >
                  {[...(i18n.languages ?? [])].sort().map((lang: string) => (
                    <MenuItem
                      selected={i18n.language === lang}
                      key={lang}
                      defaultValue={lang}
                      onClick={() => {
                        // console.log(lang);
                        changeLanguage(lang);
                      }}
                      value={lang}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Avatar
                          sx={{
                            width: "24px",
                            height: "24px",
                            marginRight: "5px",
                          }}
                          src={`/images/flags/${lang === "lo" ? "la" : lang}.svg`}
                        />
                        <Typography>
                          {lang === "en"
                            ? "English"
                            : lang === "th"
                            ? "Thai"
                            : "Lao"}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <IconButton
                color="inherit"
                onClick={() => {
                  setMode();
                }}
              >
                {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
              </IconButton>

              <Stack
                sx={{ fontFamily: "BoonBaanRegular" }}
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                <Avatar src={"./src/assets/User.png"} alt={"user profile"} />
                <div className="flex flex-col  w-full">
                  <p className="text-ellipsis whitespace-nowrap overflow-hidden">{`${user.firstname} ${user.lastname}`}</p>
                  <p>{`${user.role}`}</p>
                </div>
              </Stack>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer sx={{ zIndex: 850 }} variant="permanent" open={open}>
        <DrawerHeader>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )
          </IconButton> */}
        </DrawerHeader>
        <Divider />
        <div className=" font-semibold  mt-4">
          <List
            sx={{
              marginLeft: "8px",
              marginRight: "8px",
              color: "#FFFFFF",
              "&, & .MuiListItemIcon-root": {
                color: "#B5B8C0",
                fill: "#B5B8C0",
              },
              "& .MuiListItemButton-root:hover": {
                // bgcolor: "orange",
                borderRadius: "8px",
              },

              "&& .Mui-selected, && .Mui-selected:hover": {
                // marginLeft: "8px",
                // marginRight: "8px",
                bgcolor: "#00D1FF",
                // color : "#B5B8C0",
                borderRadius: "8px",
                "&, & .MuiListItemIcon-root": {
                  color: "#FFFFFF",

                  width: "auto",
                },
              },
            }}
          >
            <div className="flex flex-col">
              {MenuItems.map((menu, index: number) => {
                // console.log(menu);
                const isSelected = menu.url === lastPath;
                return (
                  <div key={menu.name} className="mt-2">
                    <ListItemButton
                      // selected={true}
                      selected={isSelected}
                      onClick={() => {
                        // console.log(menu, index);
                        navigate(`/${menu.url}`);
                      }}
                    >
                      <ListItemIcon className="-ml-1">
                        {!open ? (
                          <Tooltip
                            sx={{ fontFamily: "BoonBaanRegular" }}
                            title={menu.name}
                            placement="right"
                          >
                            <p>
                              {" "}
                              {menu.icon ? (
                                menu.icon({
                                  fontSize: 24,
                                  stroke: isSelected ? "white" : "#B5B8C0",
                                })
                              ) : (
                                <MenuBook />
                              )}{" "}
                            </p>
                          </Tooltip>
                        ) : (
                          <p className=" whitespace-nowrap flex ">
                            {menu.icon ? (
                              menu.icon({
                                fontSize: 24,
                                stroke: isSelected ? "white" : "#B5B8C0",
                              })
                            ) : (
                              <MenuBook />
                            )}
                            <span className="ml-4">{menu.name}</span>{" "}
                          </p>
                        )}
                      </ListItemIcon>
                    </ListItemButton>
                  </div>
                );
              })}
            </div>
          </List>
        </div>
        {/* <Divider /> */}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          maxWidth: open ? "calc(100vw - 252px)" : "calc(100vw - 64px)",
          backgroundColor: "#F2F2F2",
          minHeight: "100vh",
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}

const CustomInput = function BrowserInput(props: any) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;

  return (
    <div className="relative mr-2" style={{ fontFamily: "BoonBaanRegular" }}>
      <p className="">{props.label}</p>

      <div className="relative" ref={InputProps?.ref}>
        <div className="absolute top-1/2 left-[-4px]  -translate-y-1/2 ">
          {InputProps?.endAdornment}
        </div>

        <input
          ref={inputRef}
          {...inputProps}
          {...(other as any)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
};
