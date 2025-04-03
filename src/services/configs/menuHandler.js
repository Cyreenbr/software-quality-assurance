import { FaBook, FaGraduationCap, FaLightbulb } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import {
    MdAccountCircle,
    MdAssignmentAdd,
    MdCalendarMonth,
    MdDashboard,
    MdDownload,
    MdHome,
    MdList,
    MdNotifications,
} from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import Pfa from "../../../src/pages/pfaPage/Pfa";
import SubjectDetailsPage from "../../components/subjectsComponents/SubjectDetailsPage";
import AdminPeriods from "../../pages/adminPeriodsPage/AdminPeriods";
import AssignInternships from '../../pages/assignInternshipsPage/AssignInternshipsPage';
import Competences from "../../pages/competenecesPage/Competences";
import Dashboard from "../../pages/dashboardPage/Dashboard";
import DepotSujet from "../../pages/depotSujetStagePage/DepotSujetStage";
import ErrorPage from "../../pages/ErrorPage";
import Home from "../../pages/homePage/Home";
import Notifications from "../../pages/Notifications";
import AdminPfeManagement from "../../pages/pfePage/pfe";
import PFEStudent from "../../pages/pfePage/pfeStudent";
import InternshipPlanning from "../../pages/PlanningUpdate/InternshipPlanningUpdate";
import Profile from "../../pages/profilePage/Profile";
import InternshipList from "../../pages/studentInternshipPage/studentInternship";
import Subjects from "../../pages/subjectsPage/Subjects";
import StudentsManagPage from "../../pages/UsersManagementPage/StudentsManagPage";
import TeachersManagPage from "../../pages/UsersManagementPage/TeachersManagPage";
import { RoleEnum } from "../../utils/userRoles";

export const menuConfig = [
    {
        order: 1,
        label: "Home",
        icon: MdHome,
        path: "/",
        component: Home,
        eligibleRoles: [],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 2,
        label: "Dashboard",
        icon: MdDashboard,
        path: "/dashboard",
        component: Dashboard,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        label: "Error",
        icon: undefined,
        path: "/error",
        component: ErrorPage,
        eligibleRoles: [],
        active: true,
        dontShow: true,
        hideSideBar: true,
        hideHeader: false,
    },
    {
        order: 3,
        label: "Profile",
        icon: MdAccountCircle,
        path: "/profile",
        component: Profile,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 4,
        label: "Competences",
        icon: FaLightbulb,
        path: "/competences",
        tooltip: "Competences",
        component: Competences,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER],
        active: true,
        hideSideBar: false,
        hideHeader: false,
        // dontShow: true,
    },
    {
        order: 5,
        label: "Subjects",
        icon: FaBook,
        path: "/subjects",
        tooltip: "Subjects",
        component: Subjects,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
        // dontShow: true,
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
        label: "Notifications",
        icon: MdNotifications,
        path: "/notifications",
        component: Notifications,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 8,
        label: "PFA",
        icon: FaGraduationCap,
        path: "/PFA",
        component: Pfa,
        eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },

    {
        order: 9,
        label: "Manage Students",
        icon: PiStudentFill,
        path: "/managestudents",
        component: StudentsManagPage,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 10,
        label: "Manage Teachers",
        icon: GiTeacher,
        path: "/manageteachers",
        component: TeachersManagPage,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 12,
        label: "Period",
        icon: MdCalendarMonth,
        path: "/period",
        tooltip: "period",
        component: AdminPeriods,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 13,
        label: "Internship Deposit",
        icon: MdDownload,
        path: "/deposit",
        tooltip: "deposit",
        component: DepotSujet,
        eligibleRoles: [RoleEnum.STUDENT],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 14,
        label: "Internship List",
        icon: MdList,
        path: "/InternshipList",
        tooltip: "Internship",
        component: InternshipList,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 15,
        label: "ahmed",
        icon: MdList,
        path: "/pfe",
        tooltip: "pfe",
        component: AdminPfeManagement,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 16,
        label: "ahmed",
        icon: MdList,
        path: "/pfeStudent",
        tooltip: "pfe",
        component: PFEStudent,
        eligibleRoles: [RoleEnum.STUDENT],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 17,
        label: 'Assign Internships',
        icon: MdAssignmentAdd,
        path: '/InternshipAssignment',
        tooltip: "Internship",
        component: AssignInternships,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        dontShow: false,
        hideSideBar: false,
        hideHeader: false,
    },
    {
        order: 18,
        path: '/PlanningUpdate',
        component: InternshipPlanning,
        eligibleRoles: [RoleEnum.ADMIN],
        active: true,
        dontShow: true,
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
        .filter(
            (item) =>
                item.eligibleRoles.length === 0 || item.eligibleRoles.includes(role)
        )
        .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
};