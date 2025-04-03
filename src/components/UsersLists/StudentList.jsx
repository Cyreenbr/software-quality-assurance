import React, { useState, useEffect } from "react";
import {
  getStudents,
  editStudent,
  getStudentById,
  editPassword,
} from "../../services/ManageUsersServices/students.service";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { CgEyeAlt } from "react-icons/cg";
import { RiLockPasswordFill } from "react-icons/ri";
export default function StudentList() {
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
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
  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      if (response && response.model) {
        setStudentsList(response.model);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const EditPassword = async (passwordData) => {
    try {
      if (!selectedStudent || !selectedStudent._id) {
        console.error("No selected student found.");
        return;
      }
      const response = await editPassword(selectedStudent._id, passwordData);
      console.log("Password updated successfully:", response);
      closePasswordDialog();
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
  const watch = async (studentId) => {
    try {
      const student = studentsList.find((student) => student._id === studentId);
      if (!student) {
        console.error("Student not found");
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
    }
  };
  const edit = async (studentId) => {
    try {
      const student = studentsList.find((student) => student._id === studentId);
      if (!student) {
        console.error("Student not found");
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
    }
  };
  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedStudent._id) {
      console.error("No student selected or missing ID");
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
    } catch (error) {
      console.error("Error updating student:", error);
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
  const deleteStudent = async (studentId) => {
    //to do farah
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

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
      {/* Students List */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">List of Students</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Level:
          </label>
          <select
            value={selectedLevel}
            onChange={handleLevelFilter}
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          >
            <option value="">All Levels</option>
            <option value="1year">1 Year</option>
            <option value="2year">2 Year</option>
            <option value="3year">3 Year</option>
          </select>
        </div>
        {/* Dialog for Edit Password */}
        {isPasswordDialogOpen && (
          <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
            <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
              <div className="relative flex flex-col bg-white">
                <div className="relative m-2 items-center flex justify-center text-white h-12 rounded-md bg-indigo-600 px-4">
                  <h3 className="text-lg font-semibold">Edit Password</h3>
                </div>

                <div className="flex flex-col gap-4 p-6 max-h-[80vh] overflow-y-auto">
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
                      placeholder="Old password"
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
                      Confirm New Password
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

                <div className="p-6 pt-0 flex justify-between">
                  <button
                    className="rounded-md bg-indigo-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-indigo-500 focus:shadow-none active:bg-indigo-500 hover:bg-indigo-500 active:shadow-none"
                    type="button"
                    onClick={() => EditPassword(editedPassword)}
                  >
                    Save
                  </button>
                  <button
                    className="rounded-md bg-gray-400 py-2 px-4 text-sm text-white"
                    type="button"
                    onClick={closePasswordDialog}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}{" "}
        {/* Dialog for Edit Password */}
        {isPasswordDialogOpen && (
          <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
            <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
              <div className="relative flex flex-col bg-white">
                <div className="relative m-2 items-center flex justify-center text-white h-12 rounded-md bg-indigo-600 px-4">
                  <h3 className="text-lg font-semibold">Edit Password</h3>
                </div>

                <div className="flex flex-col gap-4 p-6 max-h-[80vh] overflow-y-auto">
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
                      placeholder="Old password"
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
                      Confirm New Password
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

                <div className="p-6 pt-0 flex justify-between">
                  <button
                    className="rounded-md bg-indigo-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-indigo-500 focus:shadow-none active:bg-indigo-500 hover:bg-indigo-500 active:shadow-none"
                    type="button"
                    onClick={() => EditPassword(editedPassword)}
                  >
                    Save
                  </button>
                  <button
                    className="rounded-md bg-gray-400 py-2 px-4 text-sm text-white"
                    type="button"
                    onClick={closePasswordDialog}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Full Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Level</th>
                <th className="py-3 px-6 text-left">Creation Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
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
                        onClick={() => edit(student._id)}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => watch(student._id)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                      >
                        <CgEyeAlt size={18} />
                      </button>
                      <button
                        onClick={() => deleteStudent(student._id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsPasswordDialogOpen(true);
                        }}
                        className="ml-2 text-gray-600 hover:text-gray-800"
                      >
                        <RiLockPasswordFill />
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
    </div>
  );
}
