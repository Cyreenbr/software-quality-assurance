import TeacherPfaComponent from "../../components/pfaComponents/teacherPfaComponent";
import { useSelector } from "react-redux";
import { RoleEnum } from "../../utils/userRoles";
import AdminPfaComponent from "../../components/pfaComponents/adminPfaComponent";

const Pfa = () => {
  const role = useSelector((state) => state.auth.role);
  console.log(role);
  switch (role) {
    case RoleEnum.TEACHER:
      return <TeacherPfaComponent />;
      break;
    case RoleEnum.ADMIN:
      return <AdminPfaComponent />;
      break;
    case RoleEnum.STUDENT:
      return <TeacherPfaComponent />;
      break;
    default:
      return <ErrorPage />;
  }
};

export default Pfa;
