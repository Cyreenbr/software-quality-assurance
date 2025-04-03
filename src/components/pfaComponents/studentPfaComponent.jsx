import React, { useState } from 'react';
import { getTeacherByName, getPfasByTeacherId } from './pfaService'; // Services pour la gestion des données

const StudentComponent = () => {
  const [teacherName, setTeacherName] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [pfas, setPfas] = useState([]);
  const [error, setError] = useState('');

  
  const handleSearchTeacher = async () => {
    if (teacherName.trim() === '') {
      setError('Please enter a teacher name');
      return;
    }

    try {
      const teacher = await getTeacherByName(teacherName); 
      if (teacher) {
        setTeacherId(teacher.id); 
        fetchPfas(teacher.id); 
      } else {
        setError('Teacher not found');
      }
    } catch (error) {
        console.error("Error API (GET PFA) :", error);
        return null;
      }
  };


  const fetchPfas = async (teacherId) => {
    try {
      const pfasData = await getPfasByTeacherId(teacherId); 
      setPfas(pfasData);
    } catch (error) {
        console.error("Error API (GET PFA) :", error);
        return null;
      }
  };

  return (
    <div className="student-component">
      <h2 className="text-xl font-semibold mb-4">Find PFAs by Teacher</h2>
      
      <input
        type="text"
        value={teacherName}
        onChange={(e) => setTeacherName(e.target.value)}
        placeholder="Enter teacher's name"
        className="border px-4 py-2 rounded"
      />
      <button
        onClick={handleSearchTeacher}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
      >
        Search
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {pfas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">PFAs for {teacherName}</h3>
          <ul>
            {pfas.map((pfa) => (
              <li key={pfa.id} className="border-b py-2">
                <strong>{pfa.projectTitle}</strong>: {pfa.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentComponent;
