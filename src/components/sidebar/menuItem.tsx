// import DashboardIcon from "./dashboardIcon"

import { ReactComponent as Ads } from "../../assets/icons/ads.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as DonotSell } from "../../assets/icons/do_not_sell.svg";
import { ReactComponent as Feedback } from "../../assets/icons/feedback.svg";
import { ReactComponent as Lotto } from "../../assets/icons/lotto_historysvg.svg";
import { Message } from "iconsax-react";
import { ReactComponent as Notification } from "../../assets/icons/notification.svg";
import { ReactComponent as Promotions } from "../../assets/icons/promotions.svg";
import React from "react";
import { ReactComponent as Setup } from "../../assets/icons/setup.svg";
import { ReactComponent as Transaction } from "../../assets/icons/tranaction.svg";
import { ReactComponent as UserManagement } from "../../assets/icons/user_management.svg";

type menuItem = {
  name: string;
  url: string;
  icon?: any;
  role: string[];
};
const data: menuItem[] = [
  {
    name: "Dashboard",
    url: "dashboard",
    icon: (props: object) => {
      return <DashboardIcon {...props} />;
    },
    role: ["user", "admin", "super_admin"],
  },
  {
    name: "Do not sell",
    url: "not_sell",
    icon: (props: object) => {
      return <DonotSell {...props} />;
    },
    role: ["user", "admin", "super_admin"],
  },
  {
    name: "Transaction",
    url: "transaction",
    icon: (props: object) => {
      return <Transaction {...props} />;
    },
    role: ["user", "admin", "super_admin"],
  },
  {
    name: "Lotto history",
    url: "lotto_history",
    icon: (props: object) => {
      return <Lotto {...props} />;
    },
    role: ["user", "external", "admin", "super_admin"],
  },
  {
    name: "Ads",
    url: "ads",
    icon: (props: object) => {
      return <Ads {...props} />;
    },
    role: ["user",  "admin", "super_admin"],
  },
  {
    name: "News",
    url: "news",
    icon: (props: object) => {
      return <Message {...props} size="24" />;
    },
    role: ["user",  "admin", "super_admin"],
  },
  {
    name: "Promotions",
    url: "promotions",
    icon: (props: object) => {
      return <Promotions {...props} />;
    },
    role: ["user",  "admin", "super_admin"],
  },
  {
    name: "Notifications",
    url: "notifications",
    icon: (props: object) => {
      return <Notification {...props} />;
    },
    role: ["user",  "admin", "super_admin"],
  },
  {
    name: "Feedback",
    url: "feedback",
    icon: (props: object) => {
      return <Feedback {...props} />;
    },
    role: ["user",  "admin", "super_admin"],
  },
  {
    name: "User Management",
    url: "user_management",
    icon: (props: object) => {
      return <UserManagement {...props} />;
    },
    role: ["user", "external", "admin", "super_admin"],
  },
  {
    name: "Setup",
    url: "setup",
    icon: (props: object) => {
      return <Setup {...props} />;
    },
    role: ["user", "admin", "super_admin"],
  },
];

export default data;
