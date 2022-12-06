import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Budget Rings",
    path: "/rings",
    icon: <IoIcons.IoIosCash />,
    cName: "nav-text",
  },
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <IoIcons.IoIosSpeedometer />,
    cName: "nav-text",
  },
  {
    title: "Goals",
    path: "/goals",
    icon: <IoIcons.IoMdTrendingUp />,
    cName: "nav-text",
  },
  {
    title: "Share",
    path: "/share",
    icon: <FaIcons.FaShareAlt />,
    cName: "nav-text",
  },
  {
    title: "Account",
    path: "/login",
    icon: <AiIcons.AiFillPicture />,
    cName: "nav-text",
  },
  {
    title: "Admin",
    path: "/admin",
    icon: <AiIcons.AiFillSetting />,
    cName: "nav-text",
  },
];
