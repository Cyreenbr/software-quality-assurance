import React, { useEffect, useState } from "react";
import { MdEmail, MdPhone, MdLocationOn, MdEdit, MdArrowBack, MdPerson, MdCalendarToday, MdCardMembership, MdPublic, MdHome } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

// Use a data URL for default avatar to avoid import issues
const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

import { getProfile } from "../../services/profile.service";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // For Vite, use import.meta.env instead of process.env
  // Or hardcode the server URL based on what you've shared
  const serverUrl = 'http://localhost:3000'; // Using port 3000 from your VITE_PORT_BACKEND

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const result = await getProfile();
      setProfile(result);
      setError(null);
      console.log("Profile data retrieved:", result);
      
      // Debug profilePhoto value
      if (result && result.data) {
        console.log("ProfilePhoto value:", result.data.profilePhoto);
        console.log("ProfilePhoto type:", typeof result.data.profilePhoto);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Impossible de charger les données du profil. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const navigateToEditProfile = () => {
    navigate("/edit-profile");
  };

  // Extract user data from profile
  const userData = profile?.data;

  // Get profile photo URL with better error handling
  const getProfilePhotoUrl = (photoData) => {
    console.log("Getting profile photo URL for:", photoData);
    
    // Only return default avatar if photoData is truly empty/null
    if (!photoData || photoData === "null" || photoData === "") {
      console.log("No photo available, using default avatar");
      return defaultAvatar;
    }
    
    // If the URL is already complete, use it
    if (photoData.startsWith('http://') || photoData.startsWith('https://')) {
      console.log("Using complete URL:", photoData);
      return photoData;
    }
    
    // Build complete URL - using correct path from backend: uploads/profiles/filename
    // The backend stores files in uploads/profiles folder
    const completeUrl = `${serverUrl}/uploads/profiles/${photoData}`;
    console.log("Constructed URL:", completeUrl);
    return completeUrl;
  };

  // Handle image error per image element instead of globally
  const handleImageError = (e) => {
    console.log("Image failed to load, using default avatar");
    e.target.src = defaultAvatar;
  };

  // Format date in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Page header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleGoBack}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <MdArrowBack size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">	My Profile</h1>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Profile banner */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        {/* Profile content */}
        <div className="px-4 md:px-8 pb-6 -mt-16 relative">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color="#6366F1" size={40} />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-6 bg-red-50 rounded-lg mt-20">
              {error}
            </div>
          ) : userData ? (
            <>
              {/* Profile photo */}
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="relative">
                  <img
                    src={getProfilePhotoUrl(userData.profilePhoto)}
                    alt="Photo de profil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-gray-200"
                    onError={handleImageError}
                  />
                  <button 
                    onClick={navigateToEditProfile}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                  >
                    <MdEdit size={16} />
                  </button>
                </div>
                
                {/* Name/Username */}
                <div className="mt-4 md:mt-0 md:ml-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {userData.firstName || ''} {userData.lastName || ''}
                  </h2>
                  {userData.firstNameArabic && userData.lastNameArabic && (
                    <p className="text-lg font-medium text-gray-700 mt-1 text-right" dir="rtl">
                      {userData.firstNameArabic} {userData.lastNameArabic}
                    </p>
                  )}
                  {userData.role && (
                    <p className="text-indigo-600 font-medium mt-1">
                      {userData.role}
                    </p>
                  )}
                </div>
                
                {/* Edit button (desktop) */}
                <div className="hidden md:block ml-auto">
                  <button 
                    onClick={navigateToEditProfile}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center"
                  >
                    <MdEdit className="mr-2" size={18} />
                    Edit profile
                  </button>
                </div>
              </div>
              
              {/* Edit button (mobile) */}
              <div className="md:hidden mt-4">
                <button 
                  onClick={navigateToEditProfile}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
                >
                  <MdEdit className="mr-2" size={18} />
                 Edit profile
                </button>
              </div>

              {/* Separator line */}
              <div className="border-b my-6"></div>
              
              {/* Contact information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <MdEmail className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-800 font-semibold">{userData.email || "Aucun email disponible"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <MdPhone className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                    <p className="text-gray-800 font-semibold">{userData.phoneNumber || "Aucun numéro disponible"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <MdCardMembership className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">CIN</p>
                    <p className="text-gray-800 font-semibold">{userData.cin || "Non spécifié"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <MdPublic className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Nationality</p>
                    <p className="text-gray-800 font-semibold">{userData.nationality || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors md:col-span-2">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <MdLocationOn className="text-indigo-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Adress</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 mt-1">
                      <p className="text-gray-800 font-semibold md:col-span-3">{userData.address || "Aucune adresse disponible"}</p>
                      {userData.gouvernorate && (
                        <p className="text-gray-700"><span className="text-gray-500 text-sm">Gouvernorate:</span> {userData.gouvernorate}</p>
                      )}
                      {userData.postalCode && (
                        <p className="text-gray-700"><span className="text-gray-500 text-sm">Postal code:</span> {userData.postalCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal information */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.sexe && (
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <MdPerson className="text-indigo-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Sexe</p>
                        <p className="text-gray-800 font-semibold">{userData.sexe}</p>
                      </div>
                    </div>
                  )}
                  
                  {userData.birthDay && (
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <MdCalendarToday className="text-indigo-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Date of Birth</p>
                        <p className="text-gray-800 font-semibold">{formatDate(userData.birthDay)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            
            </>
          ) : (
            <div className="text-center p-8 mt-20 text-gray-500 bg-gray-50 rounded-lg">
             No profile information available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;