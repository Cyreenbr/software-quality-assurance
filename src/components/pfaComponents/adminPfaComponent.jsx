import React, { useState } from "react";

// Import your components
import AdminPage from "./adminPage";
import PfaAssignmentPage from "./pfaAssignmentPage";

const AdminPfaComponent = () => {
  const [activeTab, setActiveTab] = useState("list"); // 'list' or 'assignment'

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 mb-6">
        {/* Tab 1: List of PFAs */}
        <button
          onClick={() => setActiveTab("list")}
          className={`py-2 px-4 font-medium ${
            activeTab === "list"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          List of PFAs
        </button>

        {/* Tab 2: PFA Assignment Management */}
        <button
          onClick={() => setActiveTab("assignment")}
          className={`py-2 px-4 font-medium ${
            activeTab === "assignment"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          PFA Assignment Management
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "list" && <AdminPage />}
        {activeTab === "assignment" && <PfaAssignmentPage />}
      </div>
    </div>
  );
};

export default AdminPfaComponent;