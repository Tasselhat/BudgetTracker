import React from 'react';
import * as AiIcons from "react-icons/ai";
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from "react-icons/io";


export const ProfileMenuData = [
    {
        title: 'Settings',
        path: '/settings',
        icon: <AiIcons.AiFillSetting />,
        cName: 'nav-text'
    },
    {
        title: 'View Profile',
        path: '/login',
        icon: <IoIcons.IoMdTabletPortrait />,
        cName: 'nav-text'
    },
    {
        title: 'FAQ',
        path: '/help',
        icon: <FaIcons.FaHandsHelping />,
        cName: 'nav-text'
    },
    {
        title: 'Log Out',
        path: '/logout',
        icon: <IoIcons.IoMdLogOut />,
        cName: 'nav-text'
    }
]