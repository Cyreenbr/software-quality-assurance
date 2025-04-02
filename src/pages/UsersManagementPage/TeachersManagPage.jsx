import React, { useState } from "react";
import TeacherExcel from "../../components/ImportExcel/TeacherExcel";
import { TeachersList } from "../../components/UsersLists/TeachersList";

export default function TeachersManagPage() {
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
        <TeacherExcel onBackClick={handleBackToList} />
      ) : (
        <TeachersList onAddClick={handleAddClick} />
      )}
    </div>
  );
}