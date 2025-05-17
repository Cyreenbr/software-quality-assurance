import React, { useState } from "react";

// Import your components

import TeacherPage from "./teacherPage";
import TeacherSOutenacePlanning from "./teacherSOutenacePlanning";
import StudentPage from "./studentPage";
import StudentOutenacePlanning from "./studentSOutenancePlanning";

const StudentPfaComponent = () => {
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

        <button
          onClick={() => setActiveTab("soutenance")}
          className={`py-2 px-4 font-medium ${
            activeTab === "soutenance"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          PFA Defence Planning
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "list" && <StudentPage />}
        {activeTab === "soutenance" && <StudentOutenacePlanning/>}
      </div>
    </div>
  );
};

export default StudentPfaComponent;
