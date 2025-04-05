import React, { useState, useEffect } from "react";
import {
  getTeachers,
  deleteTeacher,
  editTeacher,
  editPasswordTeacher,
} from "../../services/ManageUsersServices/teachers.service";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { CgEyeAlt } from "react-icons/cg";
import { RiLockPasswordFill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function TeachersList({ onAddClick }) {
  const [teachersList, setTeachersList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    phoneNumber: "",
    password: "",
    firstNameArabic: "",
    birthDay: "",
    sexe: "", //select "Masculin", "Féminin"
    lastNameArabic: "",
  });
  const [editedPassword, setEditedPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachers();
        if (response && response.model) {
          setTeachersList(response.model); // Initialize teachers list
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        toast.error("Failed to load teachers. Please try again.");
      }
    };

    fetchTeachers();
  }, []);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short", // e.g. "Tue"
      year: "numeric", // e.g. "2025"
      month: "short", // e.g. "Mar"
      day: "numeric", // e.g. "30"
    });
  };

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTeacherToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTeacher(teacherToDelete._id);
      // Remove the deleted teacher from the list
      const updatedTeachersList = teachersList.filter(
        (teacher) => teacher._id !== teacherToDelete._id
      );
      setTeachersList(updatedTeachersList);
      setShowDeleteModal(false);
      setTeacherToDelete(null);
      toast.success(`${teacherToDelete.firstName} ${teacherToDelete.lastName} has been deleted successfully`);
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to delete teacher. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const watch = async (teacherId) => {
    try {
      const teacher = teachersList.find((teacher) => teacher._id === teacherId);
      if (!teacher) {
        console.error("Teacher not found");
        toast.error("Teacher information could not be found");
        return;
      }

      setSelectedTeacher(teacher);
      setEditedData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        grade: teacher.grade,
        phoneNumber: teacher.phoneNumber,
        password: teacher.password,
        firstNameArabic: teacher.firstNameArabic,
        birthDay: teacher.birthDay,
        sexe: teacher.sexe,
        lastNameArabic: teacher.lastNameArabic,
      });
      setIsViewing(true);
      setIsEditing(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      toast.error("Failed to load teacher details");
    }
  };

  const edit = async (teacherId) => {
    try {
      const teacher = teachersList.find((teacher) => teacher._id === teacherId);
      if (!teacher) {
        console.error("Teacher not found");
        toast.error("Teacher information could not be found");
        return;
      }
      setSelectedTeacher(teacher);
      setEditedData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        grade: teacher.grade,
        phoneNumber: teacher.phoneNumber,
        password: teacher.password,
        firstNameArabic: teacher.firstNameArabic,
        birthDay: teacher.birthDay,
        sexe: teacher.sexe,
        lastNameArabic: teacher.lastNameArabic,
      });
      setIsViewing(false);
      setIsEditing(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      toast.error("Failed to load teacher details for editing");
    }
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedTeacher._id) {
      console.error("No teacher selected or missing ID");
      toast.error("Invalid teacher data. Please try again.");
      return;
    }
    try {
      await editTeacher(selectedTeacher._id, editedData);
      setTeachersList((prevList) =>
        prevList.map((teacher) =>
          teacher._id === selectedTeacher._id
            ? { ...teacher, ...editedData }
            : teacher
        )
      );
      closeDialog();
      toast.success("Teacher information updated successfully");
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error("Failed to update teacher information. Please try again.");
    }
  };

  const handlePasswordChange = (e) => {
    setEditedPassword({ ...editedPassword, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    
    // Vérification côté client
    if (editedPassword.newPassword !== editedPassword.confirmationPassword) {
      toast.error("New password and confirmation do not match!");
      return;
    }
    
    // Vérification de la validité du mot de passe (si vous avez des critères similaires à votre backend)
    if (editedPassword.newPassword.length < 8) { // exemple de critère
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    
    EditPassword({
      oldPassword: editedPassword.oldPassword,
      newPassword: editedPassword.newPassword,
      confirmationPassword: editedPassword.confirmationPassword
    });
  };
  
  const EditPassword = async (passwordData) => {
    try {
      if (!selectedTeacher || !selectedTeacher._id) {
        console.error("No selected teacher found.");
        toast.error("No teacher selected");
        return;
      }
      const response = await editPasswordTeacher(selectedTeacher._id, passwordData);
      console.log("Password updated successfully:", response);
      closePasswordDialog();
      // Toast de succès
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      
      // Message d'erreur précis du serveur avec toast
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.message || "An error occurred"}`);
        console.error("Details:", error.response.data);
      } else {
        toast.error("An error occurred while updating the password");
      }
    }
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTeacher(null);
    setIsEditing(false);
    setIsViewing(false);
    setEditedData({
      firstName: "",
      lastName: "",
      email: "",
      grade: "",
      phoneNumber: "",
      password: "",
      firstNameArabic: "",
      birthDay: "",
      sexe: "",
      lastNameArabic: "",
    });
  };

  const closePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
    setEditedPassword({
      oldPassword: "",
      newPassword: "",
      confirmationPassword: "",
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className="text-2xl font-bold mb-4">Manage Teachers</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">List of Teachers</h2>
          <button
            className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500"
            onClick={onAddClick}
          >
            <FaPlus size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Hiring Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachersList.length > 0 ? (
                teachersList.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-left text-gray-900">
                      {teacher.grade}
                    </td>
                    <td className="px-6 py-4 text-sm text-left text-gray-500">
                      {formatDate(teacher.hiringDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <button
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                          onClick={() => watch(teacher._id)}
                        >
                          <CgEyeAlt size={18} />
                        </button>
                        <button
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                          onClick={() => edit(teacher._id)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setIsPasswordDialogOpen(true);
                          }}
                          className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
                        >
                          <RiLockPasswordFill size={18} />
                        </button>
                        <button
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          onClick={() => handleDeleteClick(teacher)}
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    No teachers available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {teacherToDelete?.firstName}{" "}
              {teacherToDelete?.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog for Edit/View */}
      {isDialogOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-indigo-600 p-4 flex justify-center items-center text-white h-12 rounded-md">
                <h3 className="text-lg font-semibold">
                  {isViewing ? "View Teacher" : "Update Teacher"}
                </h3>
              </div>

              <div className="flex flex-col gap-4 p-6">
                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editedData.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="First name"
                    disabled={isViewing}
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editedData.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Last name"
                    disabled={isViewing}
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Email address"
                    disabled={isViewing}
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editedData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    disabled={isViewing}
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    First Name Arabic
                  </label>
                  <input
                    type="text"
                    name="firstNameArabic"
                    onChange={handleChange}
                    value={editedData.firstNameArabic}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    disabled={isViewing}
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Last Name Arabic
                  </label>
                  <input
                    type="text"
                    name="lastNameArabic"
                    onChange={handleChange}
                    value={editedData.lastNameArabic}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    disabled={isViewing}
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Grade
                  </label>
                  <input
                    type="text"
                    name="grade"
                    onChange={handleChange}
                    value={editedData.grade}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    disabled={isViewing}
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Sexe
                  </label>
                  <input
                    type="text"
                    name="sexe"
                    onChange={handleChange}
                    value={editedData.sexe}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    disabled={isViewing}
                    required
                  />
                </div>
              </div>

              <div className="p-6 pt-0 flex justify-between sticky bottom-0 bg-white">
                {!isViewing && (
                  <button
                    className="rounded-md bg-indigo-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-indigo-500 focus:shadow-none active:bg-indigo-500 hover:bg-indigo-500 active:shadow-none"
                    type="button"
                    onClick={handleSubmitEdit}
                  >
                    Save
                  </button>
                )}
                <button
                  className="rounded-md bg-gray-400 py-2 px-4 text-sm text-white"
                  type="button"
                  onClick={closeDialog}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Dialog */}
      {isPasswordDialogOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-purple-600 p-4 flex justify-center items-center text-white h-12 rounded-md">
                <h3 className="text-lg font-semibold">Change Password</h3>
              </div>

              <div className="flex flex-col gap-4 p-6">
                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Old Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={editedPassword.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={editedPassword.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmationPassword"
                    value={editedPassword.confirmationPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                </div>
              </div>

              <div className="p-6 pt-0 flex justify-between sticky bottom-0 bg-white">
                <button
                  className="rounded-md bg-purple-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 active:shadow-none"
                  type="button"
                  onClick={handleSubmitPassword}
                >
                  Change Password
                </button>
                <button
                  className="rounded-md bg-gray-400 py-2 px-4 text-sm text-white"
                  type="button"
                  onClick={closePasswordDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}