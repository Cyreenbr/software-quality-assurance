import React, { useState, useEffect } from "react";
import {
  getStudents,
  editStudent,
  editPassword,
  deleteStudent,
} from "../../services/ManageUsersServices/students.service";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { CgEyeAlt } from "react-icons/cg";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";

export default function StudentList({ onAddClick }) {
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success, error, info, warning
  });

  const [editedData, setEditedData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    level: "",
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
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setFilteredStudents(studentsList);
  }, [studentsList]);
  
  // Toast function
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };
  
  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      if (response && response.model) {
        setStudentsList(response.model);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      showToast("Impossible de récupérer la liste des étudiants", "error");
    }
  };
  
  const EditPassword = async (passwordData) => {
    try {
      if (!selectedStudent || !selectedStudent._id) {
        console.error("No selected student found.");
        showToast("Aucun étudiant sélectionné", "error");
        return;
      }
      const response = await editPassword(selectedStudent._id, passwordData);
      console.log("Password updated successfully:", response);
      closePasswordDialog();
      // Afficher un message de succès
      showToast("Mot de passe mis à jour avec succès", "success");
    } catch (error) {
      console.error("Error updating password:", error);
      
      // Afficher le message d'erreur précis du serveur
      if (error.response && error.response.data) {
        showToast(`Erreur: ${error.response.data.message || "Une erreur est survenue"}`, "error");
        console.error("Détails:", error.response.data);
      } else {
        showToast("Une erreur est survenue lors de la mise à jour du mot de passe", "error");
      }
    }
  };
  
  const watch = async (studentId) => {
    try {
      const student = studentsList.find((student) => student._id === studentId);
      if (!student) {
        console.error("Student not found");
        showToast("Étudiant non trouvé", "error");
        return;
      }

      setSelectedStudent(student);
      setEditedData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        level: student.level,
        phoneNumber: student.phoneNumber,
        password: student.password,
        firstNameArabic: student.firstNameArabic,
        birthDay: student.birthDay,
        sexe: student.sexe, //select "Masculin", "Féminin"
        lastNameArabic: student.lastNameArabic,
      });
      setIsViewing(true);
      setIsEditing(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching student:", error);
      showToast("Erreur lors de la récupération des données de l'étudiant", "error");
    }
  };
  
  const edit = async (studentId) => {
    try {
      const student = studentsList.find((student) => student._id === studentId);
      if (!student) {
        console.error("Student not found");
        showToast("Étudiant non trouvé", "error");
        return;
      }
      setSelectedStudent(student);
      setEditedData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        level: student.level,
        phoneNumber: student.phoneNumber,
        password: student.password,
        firstNameArabic: student.firstNameArabic,
        birthDay: student.birthDay,
        sexe: student.sexe, //select "Masculin", "Féminin"
        lastNameArabic: student.lastNameArabic,
      });
      setIsViewing(false);
      setIsEditing(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching student:", error);
      showToast("Erreur lors de la récupération des données de l'étudiant", "error");
    }
  };
  
  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedStudent._id) {
      console.error("No student selected or missing ID");
      showToast("Aucun étudiant sélectionné ou identifiant manquant", "error");
      return;
    }
    try {
      await editStudent(selectedStudent._id, editedData);
      setStudentsList((prevList) =>
        prevList.map((student) =>
          student._id === selectedStudent._id
            ? { ...student, ...editedData }
            : student
        )
      );
      closeDialog();
      showToast("Informations de l'étudiant mises à jour avec succès", "success");
    } catch (error) {
      console.error("Error updating student:", error);
      showToast("Erreur lors de la mise à jour de l'étudiant", "error");
    }
  };
  
  const handlePasswordChange = (e) => {
    setEditedPassword({ ...editedPassword, [e.target.name]: e.target.value });
  };
  
  const handleLevelFilter = (e) => {
    const level = e.target.value;
    setSelectedLevel(level);
    setFilteredStudents(
      level ? studentsList.filter((s) => s.level === level) : studentsList
    );
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedStudent(null);
    setIsEditing(false);
    setIsViewing(false);
    setEditedData({
      firstName: "",
      lastName: "",
      email: "",
      level: "",
      phoneNumber: "",
      password: "",
      firstNameArabic: "",
      birthDay: "",
      sexe: "", //select "Masculin", "Féminin"
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
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteStudent(studentToDelete._id);
      // Remove the deleted student from the lists
      const updatedStudentsList = studentsList.filter(
        (student) => student._id !== studentToDelete._id
      );
      setStudentsList(updatedStudentsList);
      setFilteredStudents(
        filteredStudents.filter(
          (student) => student._id !== studentToDelete._id
        )
      );
      setShowDeleteModal(false);
      setStudentToDelete(null);
      showToast("Étudiant supprimé avec succès", "success");
    } catch (error) {
      console.error("Error deleting student:", error);
      showToast("Échec de la suppression de l'étudiant. Veuillez réessayer.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    
    // Vérification côté client
    if (editedPassword.newPassword !== editedPassword.confirmationPassword) {
      showToast("Le nouveau mot de passe et la confirmation ne correspondent pas !", "error");
      return;
    }
    
    // Vérification de la validité du mot de passe (si vous avez des critères similaires à votre backend)
    if (editedPassword.newPassword.length < 8) { // exemple de critère
      showToast("Le mot de passe doit contenir au moins 8 caractères.", "error");
      return;
    }
    
    EditPassword({
      oldPassword: editedPassword.oldPassword,
      newPassword: editedPassword.newPassword,
      confirmationPassword: editedPassword.confirmationPassword
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[1000] px-4 py-3 rounded-md shadow-md flex items-center justify-between max-w-sm transition-all duration-300 ${
          toast.type === "success" ? "bg-green-500 text-white" :
          toast.type === "error" ? "bg-red-500 text-white" :
          toast.type === "warning" ? "bg-yellow-500 text-white" :
          "bg-blue-500 text-white"
        }`}>
          <p>{toast.message}</p>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            &times;
          </button>
        </div>
      )}

      {/* Dialog for Edit/View */}
      {isDialogOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-indigo-600 p-4 flex justify-center items-center text-white h-12 rounded-md">
                <h3 className="text-lg font-semibold">
                  {isViewing ? "View Student" : "Update Student"}
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
                    Level
                  </label>
                  <input
                    type="text"
                    name="level"
                    onChange={handleChange}
                    value={editedData.level}
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

      {/* Password Update Dialog */}
      {isPasswordDialogOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-purple-600 p-4 flex justify-center items-center text-white h-12 rounded-md">
                <h3 className="text-lg font-semibold">Update Password</h3>
              </div>

              <form onSubmit={handleSubmitPassword}>
                <div className="flex flex-col gap-4 p-6">
                  <div className="w-full max-w-sm min-w-[200px]">
                    <label className="block mb-2 text-sm text-slate-600">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={editedPassword.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                      placeholder="Current password"
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
                      placeholder="New password"
                      required
                    />
                  </div>

                  <div className="w-full max-w-sm min-w-[200px]">
                    <label className="block mb-2 text-sm text-slate-600">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmationPassword"
                      value={editedPassword.confirmationPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
                <div className="p-6 pt-0 flex justify-between sticky bottom-0 bg-white">
                  <button
                    className="rounded-md bg-purple-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 active:shadow-none"
                    type="submit"
                  >
                    Update Password
                  </button>
                  <button
                    className="rounded-md bg-gray-400 py-2 px-4 text-sm text-white"
                    type="button"
                    onClick={closePasswordDialog}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">List of Students</h2>
          <button
            className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500"
            onClick={onAddClick}
          >
            <FaPlus size={18} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="mb-4">
            <label
              htmlFor="levelFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Level:
            </label>
            <select
              id="levelFilter"
              value={selectedLevel}
              onChange={handleLevelFilter}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Levels</option>
              <option value="1year">1 Year</option>
              <option value="2year">2 Year</option>
              <option value="3year">3 Year</option>
            </select>
          </div>
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
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Creation Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-3 px-6 text-left">{student.email}</td>
                    <td className="py-3 px-6 text-left">{student.level}</td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="py-3 px-6 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => watch(student._id)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                      >
                        <CgEyeAlt size={18} />
                      </button>
                      <button
                        onClick={() => edit(student._id)}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsPasswordDialogOpen(true);
                        }}
                        className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
                      >
                        <RiLockPasswordFill size={18} />
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        onClick={() => handleDeleteClick(student)}
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No students available
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
              Are you sure you want to delete {studentToDelete?.firstName}{" "}
              {studentToDelete?.lastName}? This action cannot be undone.
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
    </div>
  );
}