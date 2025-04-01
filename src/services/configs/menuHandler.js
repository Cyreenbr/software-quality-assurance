
import { FaBook } from "react-icons/fa";
import { MdAccountCircle, MdDashboard, MdDownload, MdHome, MdList, MdNotifications, MdViewAgenda } from "react-icons/md";
import AdminPeriods from '../../pages/adminPeriodsPage/AdminPeriods';
import Dashboard from '../../pages/dashboardPage/Dashboard';
import DepotSujet from "../../pages/depotSujetStagePage/DepotSujetStage";
import ErrorPage from "../../pages/ErrorPage";
import Home from '../../pages/homePage/Home';
import Notifications from '../../pages/Notifications';
import Profile from '../../pages/profilePage/Profile';
import InternshipList from "../../pages/studentInternshipPage/studentInternship";
import Subjects from '../../pages/subjectsPage/Subjects';
import { RoleEnum } from "../../utils/userRoles";
export const menuConfig = [
    {
        order: 1,
        label: 'Home',
        icon: MdHome,
        path: '/',
        component: Home,
        eligibleRoles: [],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 2,
        label: 'Dashboard',
        icon: MdDashboard,
        path: '/dashboard',
        component: Dashboard,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {

        label: 'Error',
        icon: undefined,
        path: '/error',
        component: ErrorPage,
        eligibleRoles: [],
        active: true,
        dontShow: true,
        hideSideBar: true,
        hideHeader: false,
    },
    {
        order: 3,
        label: 'Profile',
        icon: MdAccountCircle,
        path: '/profile',
        component: Profile,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },

    {
        order: 5,
        label: 'Subjects',
        icon: FaBook,
        path: '/subjects',
        tooltip: 'Subjects',
        component: Subjects,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 6,
        label: 'Notifications',
        icon: MdNotifications,
        path: '/notifications',
        component: Notifications,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        label: 'Period',
        icon: MdViewAgenda,
        path: '/period',
        tooltip: "period",
        component: AdminPeriods,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
        {
        label: 'Depot',
        icon: MdDownload,
        path: '/deposit',
        tooltip: "depot",
        component: DepotSujet,
        eligibleRoles: [RoleEnum.STUDENT],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        label: 'Internship',
        icon: MdList,
        path: '/InternshipList',
        tooltip: "Internship",
        component: InternshipList,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
    // kifeh tzid route jdid ??
    // {
    //     order: 7,
    //     label: 'TEST',
    //     icon: MdNotifications,
    //     path: '/notifications',
    //     component: Notifications, //componet mta3 l page .JSX li sna3to enta
    //     eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
    //     active: true,
    //     hideSideBar: false,
    //     hideHeader: false,
    // },
];

export const getMenuItems = (role) => {
    return menuConfig
        .filter(item => item?.dontShow !== true)
        .filter(item => item.eligibleRoles.length === 0 || item.eligibleRoles.includes(role))
        .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
};
