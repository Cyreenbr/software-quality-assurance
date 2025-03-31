
import { FaBook } from "react-icons/fa";
import { MdAccountCircle, MdDashboard, MdHome, MdNotifications } from "react-icons/md";
import Dashboard from '../../pages/dashboardPage/Dashboard';
import ErrorPage from "../../pages/ErrorPage";
import Home from '../../pages/homePage/Home';
import Notifications from '../../pages/Notifications';
import Profile from '../../pages/profilePage/Profile';
import Subjects from '../../pages/subjectsPage/Subjects';
import { RoleEnum } from "../../utils/userRoles";

export const menuConfig = [
    {
        label: 'Error',
        icon: undefined,
        path: '/error',
        tooltip: undefined,
        component: ErrorPage,
        eligibleRoles: [],
        active: true,
        dontShow: true,
        hideSideBar: true,
        hideHeader: false,
    },
    {
        label: 'Home',
        icon: MdHome,
        path: '/',
        tooltip: 'Home',
        component: Home,
        eligibleRoles: [],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        label: 'Dashboard',
        icon: MdDashboard,
        path: '/dashboard',
        tooltip: 'Dashboard',
        component: Dashboard,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        label: 'Profile',
        icon: MdAccountCircle,
        path: '/profile',
        tooltip: 'Profile',
        component: Profile,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
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
        label: 'Notifications',
        icon: MdNotifications,
        path: '/notifications',
        tooltip: 'Notifications',
        component: Notifications,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    // {
    //     label: 'Signin',
    //     icon: BiLogInCircle,
    //     path: '/signin',
    //     tooltip: 'Signin',
    //     component: SignIn,
    //     eligibleRoles: [!RoleEnum.ADMIN, !RoleEnum.TEACHER, !RoleEnum.STUDENT],
    //     active: true,
    //     hideSideBar: false,
    //     hideHeader: false,
    // },
    // {
    //     label: 'Register',
    //     icon: FaRegUser,
    //     path: '/signup',
    //     tooltip: 'Register',
    //     component: SignUp,
    //     eligibleRoles: [!RoleEnum.ADMIN, !RoleEnum.TEACHER, !RoleEnum.STUDENT],
    //     active: true,
    //     hideSideBar: false,
    //     hideHeader: false,
    // },
];

export const getMenuItems = (role) => {
    return menuConfig
        // Exclure les éléments dont 'dontShow' est true
        .filter(item => item?.dontShow !== true)
        // Filtrer les éléments selon les rôles éligibles
        .filter(item => item.eligibleRoles.length === 0 || item.eligibleRoles.includes(role));
};