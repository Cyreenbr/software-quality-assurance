
import { FaBook } from "react-icons/fa";
import { MdAccountCircle, MdDashboard, MdHome, MdNotifications } from "react-icons/md";
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Subjects from '../pages/Subjects';
import { RoleEnum } from "../utils/userRoles";

export const menuConfig = [
    {
        label: 'Home',
        icon: MdHome,
        path: '/',
        tooltip: 'Home',
        component: Home,
        eligibleRoles: [],
        active: true
    },
    {
        label: 'Dashboard',
        icon: MdDashboard,
        path: '/dashboard',
        tooltip: 'Dashboard',
        component: Dashboard,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true
    },
    {
        label: 'Profile',
        icon: MdAccountCircle,
        path: '/profile',
        tooltip: 'Profile',
        component: Profile,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true
    },
    {
        label: 'Subjects',
        icon: FaBook,
        path: '/subjects',
        tooltip: 'Subjects',
        component: Subjects,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER],
        active: true
    },
    // {
    //     label: 'Competences',
    //     icon: FaLightbulb,
    //     path: '/competences',
    //     tooltip: 'Competences',
    //     component: Competences,
    //     eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER],
    //     active: true
    // },
    {
        label: 'Notifications',
        icon: MdNotifications,
        path: '/notifications',
        tooltip: 'Notifications',
        component: Notifications,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true
    }, {
        label: 'Test',
        icon: MdNotifications,
        path: '/test',
        tooltip: 'Tests',
        component: Notifications,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true
    },
];


export const getMenuItems = (role) => {
    return menuConfig.filter(item => item.eligibleRoles.length === 0 || item.eligibleRoles.includes(role));
};