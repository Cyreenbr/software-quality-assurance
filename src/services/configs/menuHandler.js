import {
  FaBook,
  FaGraduationCap,
  FaLightbulb,
  FaWindowRestore,
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import {
  MdAccountCircle,
  MdAssignmentAdd,
  MdAutoStories,
  MdCalendarMonth,
  MdDownload,
  MdHome,
  MdList,
  MdNotifications,
} from "react-icons/md";
import { PiStudentBold, PiStudentFill } from "react-icons/pi";
import Pfa from "../../../src/pages/pfaPage/Pfa";
import SubjectDetailsPage from "../../components/subjectsComponents/SubjectDetailsPage";
import AdminPeriods from "../../pages/adminPeriodsPage/AdminPeriods";
import AssignInternships from "../../pages/assignInternshipsPage/AssignInternshipsPage";
import Competences from "../../pages/competenecesPage/Competences";
import DepotSujet from "../../pages/depotSujetStagePage/DepotSujetStage";
import ErrorPage from "../../pages/ErrorPage";
import Home from "../../pages/homePage/Home";
import Notifications from "../../pages/Notifications";
import OptionListPage from "../../pages/optionPage/OptionListPage";
import OptionPage from "../../pages/optionPage/OptionPage";
import OptionsListForStudentPage from "../../pages/optionsListForStudentsPage/OptionsListForStudentsPage.jsx";
import AdminPfeManagement from "../../pages/pfePage/pfeadmin";
import TeacherPFEList from "../../pages/pfePage/pfeens";
import PFEStudent from "../../pages/pfePage/pfeStudent";
import PlanningPage from "../../pages/pfePage/planning";
import PlanninginternshipPage from "../../pages/planningPage/PlanningPage";
import InternshipPlanning from "../../pages/PlanningUpdate/InternshipPlanningUpdate";
import InternshipList from "../../pages/studentInternshipPage/studentInternship";
import EvaluationFormPage from "../../pages/subjectsPage/EvaluationPage.jsx";
import Subjects from "../../pages/subjectsPage/Subjects";
import TeacherInternshipList from "../../pages/teacherInternshipPage/TeacherInternshipPage";
import StudentsListTeachers from "../../pages/usersListPage/StudentsListTeachers";
import StudentsManagPage from "../../pages/UsersManagementPage/StudentsManagPage";
import TeachersManagPage from "../../pages/UsersManagementPage/TeachersManagPage";
import { RoleEnum } from "../../utils/userRoles";

import AdminPlanningPage from "../../pages/pfePage/pfeSoutenance/PFEDefenseManagement";
import EnseignantPage from "../../pages/pfePage/pfeSoutenance/EnseignantPage";
import EtudiantSoutenancePage from "../../pages/pfePage/pfeSoutenance/EtudiantSoutenancePage";

import Profile from "../../pages/profilePage/Profile";
import UniversityYearPage from "../../pages/universityYearPage/UniversityYearPage";

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
  // {
  //   order: 2,
  //   label: "Dashboard",
  //   icon: MdDashboard,
  //   path: "/dashboard",
  //   component: Dashboard,
  //   eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
  //   active: true,
  //   hideSideBar: false,
  //   hideHeader: false,
  // },
  {
    label: "Error",
    icon: undefined,
    path: "/error",
    component: ErrorPage,
    eligibleRoles: [],
    active: true,
    dontShow: true,
    hideSideBar: false,
    hideHeader: false,
  },
  // {
  //   order: 3,
  //   label: "Profile",
  //   icon: MdAccountCircle,
  //   path: "/profile",
  //   component: Profile,
  //   eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
  //   active: true,
  //   hideSideBar: false,
  //   hideHeader: false,
  // },
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
  }, {
    order: 77,
    // label: 'Subject Details',
    icon: undefined,
    path: (id) => `/subjects/${id}/evaluation`, // Dynamic path
    component: EvaluationFormPage,
    eligibleRoles: [RoleEnum.STUDENT],
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
    dontShow: true,
    hideHeader: false,
  },
  {
    order: 8,
    label: "PFA",
    icon: FaGraduationCap,
    path: "/PFA",
    component: Pfa,
    eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER, RoleEnum.STUDENT],
    // eligibleLevels: [RoleEnum.ISPFA],
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
    order: 11,
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
    order: 12,
    label: "Choose Option",
    icon: MdAutoStories,
    path: "/chooseoption",
    component: OptionPage,
    eligibleRoles: [RoleEnum.STUDENT],
    active: true,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 13,
    label: "My internships",
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
    label: "PFE",
    icon: FaGraduationCap,
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
    order: 27,
    label: "PFE",
    icon: FaGraduationCap,
    path: "/pfeplanning",
    tooltip: "pfe",
    component: PlanningPage,
    eligibleRoles: [RoleEnum.ADMIN, RoleEnum.STUDENT, RoleEnum.TEACHER],
    eligibleLevels: [RoleEnum.ISPFE],
    active: true,
    dontShow: true,
    hideSideBar: false,
    hideHeader: false,
  },


  {
    order: 16,
    label: "PFE",
    icon: FaGraduationCap,
    path: "/pfestudent",
    tooltip: "pfe",
    component: PFEStudent,
    eligibleRoles: [RoleEnum.STUDENT],
    eligibleLevels: [RoleEnum.ISPFE],
    active: true,
    dontShow: false,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 17,
    label: "Assign Internships",
    icon: MdAssignmentAdd,
    path: "/InternshipAssignment",
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
    path: "/PlanningUpdate",
    component: InternshipPlanning,
    eligibleRoles: [RoleEnum.ADMIN],
    active: true,
    dontShow: true,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 19,
    label: "Options List",
    icon: FaWindowRestore,
    path: "/OptionsList",
    component: OptionListPage,
    eligibleRoles: [RoleEnum.ADMIN],
    active: true,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 20,
    label: "Students List",
    icon: PiStudentBold,
    path: "/StudentsList",
    component: StudentsListTeachers,
    eligibleRoles: [RoleEnum.TEACHER],
    active: true,
    hideSideBar: false,
    hideHeader: false,
  },

  {
    order: 21,
    label: "Internship List",
    icon: MdList,
    path: "/TeacherInternshipList",
    component: TeacherInternshipList,
    eligibleRoles: [RoleEnum.TEACHER],
    active: true,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 22,
    label: "PFE",
    icon: FaGraduationCap,
    path: "/pfeens",
    tooltip: "pfe",
    component: TeacherPFEList,
    eligibleRoles: [RoleEnum.TEACHER],
    active: true,
    dontShow: false,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 27,
    label: "Planning",
    icon: MdList,
    path: "/planning",
    tooltip: "planning",
    component: PlanninginternshipPage,
    eligibleRoles: [RoleEnum.ADMIN, RoleEnum.STUDENT, RoleEnum.TEACHER],
    active: true,
    dontShow: true,
    hideSideBar: false,
    hideHeader: false,
  },


  {
    order: 28,
    label: "soutenancePlanning",
    icon: MdList,
    path: "/soutenancePlanning",
    tooltip: "soutenancePlanning",
    component: AdminPlanningPage,
    eligibleRoles: [RoleEnum.ADMIN],
    active: true,
    dontShow: false,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 29,
    label: "soutenanceEnseignantPage",
    icon: MdList,
    path: "/soutenanceEnseignantPage",
    tooltip: "soutenanceEnseignantPage",
    component: EnseignantPage,
    eligibleRoles: [RoleEnum.TEACHER],
    active: true,
    dontShow: false,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 30,
    label: "EtudiantSoutenancePage",
    icon: MdList,
    path: "/EtudiantSoutenancePage",
    tooltip: "EtudiantSoutenancePage",
    component: EtudiantSoutenancePage,
    eligibleRoles: [RoleEnum.STUDENT],
    eligibleLevels: [RoleEnum.ISPFE],
    active: true,
    dontShow: false,
    hideSideBar: false,
    hideHeader: false,
  },


  /*
  {
    order: 28,
    label: "CVAcademic",
    icon: MdList,
    path: "/cv/generate/:id",
    tooltip: "StudentCVPage ",
    component: StudentCVPage,
    eligibleRoles: [RoleEnum.ADMIN, RoleEnum.TEACHER],
    active: true,
    dontShow: true,
    hideSideBar: false,
    hideHeader: false,
  },*/
  {
    order: 31,
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
    order: 32,
    label: "List Options",
    icon: MdAutoStories,
    path: "/list-options",
    component: OptionsListForStudentPage,
    eligibleRoles: [RoleEnum.STUDENT],
    active: true,
    hideSideBar: false,
    hideHeader: false,
  },
  {
    order: 33,
    label: "Manage University Year",
    icon: MdAutoStories,
    path: "/UniversityYear",
    component: UniversityYearPage,
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

export const getMenuItems = (role, level = null) => {
  return (menuConfig || [])
    .filter((item) => item?.dontShow !== true)
    .filter((item) => {
      const eligibleRoles = Array.isArray(item.eligibleRoles)
        ? item.eligibleRoles
        : [];
      const eligibleLevels = Array.isArray(item.eligibleLevels)
        ? item.eligibleLevels
        : [];

      // For STUDENTS: must match both role and level
      if (role === RoleEnum.STUDENT) {
        return (
          (eligibleRoles.length === 0 || eligibleRoles.includes(role)) &&
          (eligibleLevels.length === 0 || eligibleLevels.includes(level))
        );
      }

      // For other roles: just check eligibleRoles
      return eligibleRoles.length === 0 || eligibleRoles.includes(role);
    })
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
};
