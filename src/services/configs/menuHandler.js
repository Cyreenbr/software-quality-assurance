
import { FaBook } from "react-icons/fa";
import { MdAccountCircle, MdDashboard, MdHome, MdNotifications, MdAutoStories } from "react-icons/md";
import Dashboard from '../../pages/dashboardPage/Dashboard';
import ErrorPage from "../../pages/ErrorPage";
import Home from '../../pages/homePage/Home';
import Notifications from '../../pages/Notifications';
import Profile from '../../pages/profilePage/Profile';
import Subjects from '../../pages/subjectsPage/Subjects';
import { RoleEnum } from "../../utils/userRoles";
import OptionPage from "../../pages/optionPage/OptionPage";
import StudentsManagPage from "../../pages/UsersManagementPage/StudentsManagPage";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import TeachersManagPage from "../../pages/UsersManagementPage/TeachersManagPage";
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
        order: 7,
        label: 'Choose Option',
        icon: MdAutoStories,
        path: '/chooseoption',
        component: OptionPage,
        eligibleRoles: [RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 8,
        label: 'Manage Students',
        icon: PiStudentFill,
        path: '/managestudents',
        component: StudentsManagPage,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 9,
        label: 'Manage Teachers',
        icon: GiTeacher,
        path: '/manageteachers',
        component: TeachersManagPage,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
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
