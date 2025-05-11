import React, { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";

export default function ManualAssignment() {
  const [pfas, setPfas] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedPfa, setSelectedPfa] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [forceAssign, setForceAssign] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const pfaList = await pfaService.getPfas();
      const studentResponse = await pfaService.getStudents();

      // 👇 Ajout d'une vérification du format
      const extractedStudents = Array.isArray(studentResponse)
        ? studentResponse
        : studentResponse?.students || [];

      setPfas(Array.isArray(pfaList) ? pfaList : []);
      setStudents(extractedStudents);
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedPfa || !selectedStudent) {
      alert("Please select both a student and a PFA");
      return;
    }

    try {
      await pfaService.assignPfaToStudent(selectedPfa, selectedStudent, forceAssign);
      alert("PFA assigned successfully");
    } catch (err) {
      alert(err.error || "Assignment failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Assign PFA to Student</h2>

      <label className="block mb-2">Select a Student:</label>
      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
        className="w-full mb-4 border rounded p-2"
      >
        <option value="">-- Choose a student --</option>
        {Array.isArray(students) &&
          students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
      </select>

      <label className="block mb-2">Select a PFA:</label>
      <select
        value={selectedPfa}
        onChange={(e) => setSelectedPfa(e.target.value)}
        className="w-full mb-4 border rounded p-2"
      >
        <option value="">-- Choose a PFA --</option>
        {Array.isArray(pfas) &&
          pfas.map((pfa) => (
            <option key={pfa._id} value={pfa._id}>
              {pfa.title}
            </option>
          ))}
      </select>

      <label className="inline-flex items-center mb-4">
        <input
          type="checkbox"
          checked={forceAssign}
          onChange={(e) => setForceAssign(e.target.checked)}
          className="mr-2"
        />
        Force assignment (replace existing)
      </label>

      <button
        onClick={handleAssign}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Assign PFA
      </button>
    </div>
  );
}
