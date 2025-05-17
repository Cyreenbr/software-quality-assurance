import React, { useState, useEffect } from "react";
import { MdArrowBack, MdSave, MdUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import profileService from "../../services/profile.service";

// Use a data URL for default avatar
const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    firstNameArabic: "",
    lastNameArabic: "",
    email: "",
    phoneNumber: "",
    address: "",
    gouvernorate: "",
    postalCode: "",
    nationality: "",
    cin: "",
    birthDay: "",
    sexe: "",
    role: "",
    level: ""
  });

  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [originalProfileData, setOriginalProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await profileService.getProfile();
      console.log("Profile data received:", response);
      
      if (response && response.data) {
        const profileData = response.data;
        // Store original profile data
        setOriginalProfileData(profileData);
        
        // Initialize form fields with existing data
        setFormData({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          firstNameArabic: profileData.firstNameArabic || "",
          lastNameArabic: profileData.lastNameArabic || "",
          email: profileData.email || "",
          phoneNumber: profileData.phoneNumber || "",
          address: profileData.address || "",
          gouvernorate: profileData.gouvernorate || "",
          postalCode: profileData.postalCode || "",
          nationality: profileData.nationality || "",
          cin: profileData.cin || "",
          birthDay: profileData.birthDay ? new Date(profileData.birthDay).toISOString().split('T')[0] : "",
          sexe: profileData.sexe || "",
          role: profileData.role || "",
          level: profileData.level || ""
        });
        
        // Set profile photo preview
        if (profileData.profilePhoto) {
          setPhotoPreview(profileService.getProfilePhotoUrl(profileData.profilePhoto, defaultAvatar));
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Impossible de charger les données du profil. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("La taille de l'image ne doit pas dépasser 5Mo");
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError("Format de fichier non pris en charge. Utilisez JPG, JPEG ou PNG.");
        return;
      }
      
      setNewPhotoFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Use the profileService to update the profile with form data and photo
      const response = await profileService.updateProfile(formData, newPhotoFile);
      
      console.log("Server response:", response);
      
      setSuccessMessage("Profil mis à jour avec succès!");
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Une erreur s'est produite lors de la mise à jour du profil.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    navigate('/profile');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleGoBack}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <MdArrowBack size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Modifier Mon Profil</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#6366F1" size={40} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Error or success messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Profile photo */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={photoPreview || defaultAvatar}
                  alt="Photo de profil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md bg-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg cursor-pointer">
                  <MdUpload size={16} />
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <label htmlFor="photo-upload" className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">
                Changer la photo de profil
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés: JPG, JPEG, PNG. Taille max: 5MB
              </p>
            </div>

            {/* Form sections */}
            <div className="space-y-8">
              {/* Personal information section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* French name */}
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Votre prénom"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Votre nom"
                    />
                  </div>

                  {/* Arabic name */}
                  <div>
                    <label htmlFor="firstNameArabic" className="block text-gray-700 font-medium mb-2">
                      الإسم
                    </label>
                    <input
                      type="text"
                      id="firstNameArabic"
                      name="firstNameArabic"
                      value={formData.firstNameArabic}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                      dir="rtl"
                      placeholder="اسمك"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastNameArabic" className="block text-gray-700 font-medium mb-2">
                      اللقب
                    </label>
                    <input
                      type="text"
                      id="lastNameArabic"
                      name="lastNameArabic"
                      value={formData.lastNameArabic}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                      dir="rtl"
                      placeholder="لقبك"
                    />
                  </div>
                  
                  {/* Birth information */}
                  <div>
                    <label htmlFor="birthDay" className="block text-gray-700 font-medium mb-2">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="birthDay"
                      name="birthDay"
                      value={formData.birthDay}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="sexe" className="block text-gray-700 font-medium mb-2">
                      Sexe
                    </label>
                    <select
                      id="sexe"
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>

                  {/* Role and level */}
                  <div>
                    <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                      Rôle
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Étudiant, Enseignant, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-gray-700 font-medium mb-2">
                      Niveau
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="1year">Première année</option>
                      <option value="2year">Deuxième année</option>
                      <option value="3year">Troisième année</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact and Identification Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact et identification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="cin" className="block text-gray-700 font-medium mb-2">
                      CIN
                    </label>
                    <input
                      type="text"
                      id="cin"
                      name="cin"
                      value={formData.cin}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Numéro de CIN"
                    />
                  </div>

                  <div>
                    <label htmlFor="nationality" className="block text-gray-700 font-medium mb-2">
                      Nationalité
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Votre nationalité"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Adresse</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                      Adresse complète
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Votre adresse complète"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="gouvernorate" className="block text-gray-700 font-medium mb-2">
                        Gouvernorat
                      </label>
                      <input
                        type="text"
                        id="gouvernorate"
                        name="gouvernorate"
                        value={formData.gouvernorate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Votre gouvernorat"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-gray-700 font-medium mb-2">
                        Code Postal
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Code postal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleGoBack}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <ClipLoader color="#ffffff" size={16} className="mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <MdSave className="mr-2" size={18} />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;