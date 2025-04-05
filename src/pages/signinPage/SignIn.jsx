import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import backgroundImage from "/src/assets/ISAMMBackground.jpg";
import { loginUser } from "../../redux/authSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = (values) => {
    const error = {};
    const emailRegex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      error.email = "Format not valid!";
    }

    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const result = await dispatch(loginUser(formData));

        if (result.meta.requestStatus === "fulfilled") {
          // login with success
          navigate("/");
        } else if (result.payload) {
          //error message from payload
          const errorMessage =
            result.payload.error ||
            result.payload.message ||
            "Invalid credentials";

          // error messages
          let title = "Login Failed";
          let text = errorMessage;

          if (errorMessage.includes("User not found")) {
            title = "User Not Found";
            text =
              "We couldn't find an account with this email. Please check your email address.";
          } else if (errorMessage.includes("Invalid credentials")) {
            title = "Incorrect Credentials";
            text = "Please verify your password, then try again.";
          }

          Swal.fire({
            title: title,
            text: text,
            icon: "error",
          });
        } else {
          // error
          Swal.fire({
            title: "Login failed",
            text: "An error occurred during login. Please try again.",
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Login failed",
          text: error.message || "An unexpected error occurred",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})`, overflow: "hidden" }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        {/* Error Messages */}
        {formErrors.email && (
          <div className="text-red-500 text-center mb-4">
            {formErrors.email}
          </div>
        )}
        {formErrors.password && (
          <div className="text-red-500 text-center mb-4">
            {formErrors.password}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? (
                  <span className="text-gray-500">🙉</span>
                ) : (
                  <span className="text-gray-500">🙈</span>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {!loading ? "Log In" : <ClipLoader color="#ffffff" size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
