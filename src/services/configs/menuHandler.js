import { FaBook, FaLightbulb } from 'react-icons/fa';
import { MdAccountCircle, MdDashboard, MdHome, MdNotifications } from 'react-icons/md';
import SubjectDetailsPage from '../../components/subjectsComponents/SubjectDetailsPage';
import Competences from '../../pages/competenecesPage/Competences';
import Dashboard from '../../pages/dashboardPage/Dashboard';
import ErrorPage from '../../pages/ErrorPage';
import Home from '../../pages/homePage/Home';
import Notifications from '../../pages/Notifications';
import Profile from '../../pages/profilePage/Profile';
import Subjects from '../../pages/subjectsPage/Subjects';
import { RoleEnum } from '../../utils/userRoles';

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
        order: 4,
        label: 'Competences',
        icon: FaLightbulb,
        path: '/competences',
        tooltip: 'Competences',
        component: Competences,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER],
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
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 6,
        // label: 'Subject Details',
        icon: undefined,
        path: (id) => `/subjects/${id}`, // Dynamic path
        component: SubjectDetailsPage,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
        dontShow: true
    },
    {
        order: 7,
        label: 'Notifications',
        icon: MdNotifications,
        path: '/notifications',
        component: Notifications,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
];

export const getMenuItems = (role) => {
    return menuConfig
        .filter((item) => item?.dontShow !== true)
        .filter((item) => item.eligibleRoles.length === 0 || item.eligibleRoles.includes(role))
        .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
};