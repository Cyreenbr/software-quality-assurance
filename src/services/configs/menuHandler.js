import { FaBook, FaGraduationCap, FaLightbulb } from 'react-icons/fa';
import { MdAccountCircle, MdDashboard, MdHome, MdNotifications, MdSchool } from 'react-icons/md';
import Pfa from '../../../src/pages/pfaPage/Pfa';
import SubjectDetailsPage from '../../components/subjectsComponents/SubjectDetailsPage';
import Competences from '../../pages/competenecesPage/Competences';
import Dashboard from '../../pages/dashboardPage/Dashboard';
import ErrorPage from '../../pages/ErrorPage';
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
import { RoleEnum } from '../../utils/userRoles';
d2d5ab050b88c9a74e5de760a9ed73b7f984f89c
import StudentManag from '../../pages/StudentManag';
import SignIn from '../../pages/signinPage/SignIn';
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
        dontShow: true,
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
        dontShow: true,
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
        dontShow: true,
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
    {
        order: 8,
        label: 'PFA',
        icon: FaGraduationCap,
        path: '/PFA',
        component: Pfa,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,

    },
    {
        order: 9,
        label: 'Student Management',
        icon: MdSchool,
        path: '/student-management',
        component: StudentManag,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        hideSideBar: false,
        hideHeader: false,

    },
    {
        order: 10,
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
        order: 11,
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
        order: 12,
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
        .filter((item) => item?.dontShow !== true)
        .filter((item) => item.eligibleRoles.length === 0 || item.eligibleRoles.includes(role))
        .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
};