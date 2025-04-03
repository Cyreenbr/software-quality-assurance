import React, { useState } from "react";
import StudentList from "../../components/UsersLists/StudentList";
import StudentExcel from "../../components/ImportExcel/StudentExcel";

export default function StudentsManagPage() {
  const [showExcel, setShowExcel] = useState(false);
  
  const handleAddClick = () => {
    setShowExcel(true);
  };
  
  const handleBackToList = () => {
    setShowExcel(false);
  };

  return (
    <div>
      {showExcel ? (
        <StudentExcel onBackClick={handleBackToList} />
      ) : (
        <StudentList onAddClick={handleAddClick} />
      )}
    </div>
  );
}