import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/AccountServices/account.service";
import backgroundImage from "/src/assets/ISAMMBackground.jpg";

const AddStudent = ({ onBackClick }) => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("1year");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setLevel("1year");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    if (!firstName || !lastName || !email || !level || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      level,
      password,
    };

    console.log(userData);
    console.log(registerUser);
    
    try {
      const response = await registerUser(userData);
      console.log("User registered:", response);
      
      // Afficher un message de succès
      setSuccessMessage(`Student ${firstName} ${lastName} registered successfully!`);
      
      // Réinitialiser le formulaire pour un nouvel enregistrement
      resetForm();
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
      // Ne pas naviguer - rester sur cette page
    } catch (error) {
      console.error("Error registering user:", error);
      alert(`Registration error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Modified handleBackClick to use the onBackClick prop if provided
  const handleBackClick = () => {
    if (onBackClick) {
      // Use the callback prop from StudentExcel
      onBackClick();
    } else {
      // Fallback to navigation if not called from StudentExcel
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/managestudents");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Image de fond fixe */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: "fixed"
        }}
      ></div>
      
      {/* Overlay avec léger flou */}
      <div className="fixed inset-0 z-0 bg-black/30 backdrop-blur-sm"></div>
      
      {/* Conteneur du formulaire - centré sans overflow */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/95 shadow-lg rounded-lg m-4 mt-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Add New Student</h1>
          <button 
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              FirstName
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your firstName"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
              Lastname
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={lastName}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your lastname"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700"
            >
              Level
            </label>
            <select
              id="level"
              name="level"
              value={level}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="1year">1 year</option>
              <option value="2year">2 year</option>
              <option value="3year">3 year</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register Student
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;