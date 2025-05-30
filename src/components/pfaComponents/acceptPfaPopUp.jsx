import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";

export default function AcceptPfaPopUp({
  pfaPriority,
  pfaId,
  setIsAcceptPfaDialogOpen,
}) {
  const [updatedPfaPriority, setUpdatedPfaPriority] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  const acceptBinome = async (data) => {
    console.log(pfaId, data, "this is function");
    const response = await pfaService.acceptBinome(pfaId, data);
    console.log(response);
  };

  const fetchStudents = async () => {
    try {
      const response = await pfaService.getStudents();

      if (!response) {
        throw new Error("The API did not return an array of students.");
      }
      console.log(response);

      const studentMap = new Map(
        response.students.map((student) => [student._id, student.firstName])
      );
      setUpdatedPfaPriority(
        pfaPriority.map((pfa) => ({
          ...pfa,
          monomeName: studentMap.get(pfa.monome) || "Unknown",
          binomeName: studentMap.get(pfa.binome) || "Unknown",
        }))
      );
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-300 px-6 py-4">
          <h3 className="text-lg font-bold text-white text-center">
            Select a Student Pair to Assign This PFA
          </h3>
        </div>

        {/* Content */}
        <div className="bg-white px-6 py-4 max-h-60 overflow-y-auto space-y-3">
          {updatedPfaPriority.length > 0 ? (
            updatedPfaPriority.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-purple rounded-md shadow-sm hover:shadow-md transition-all"
              >
                {/* Noms */}
                <div className="flex flex-col text-sm text-gray-800">
                  <span className="font-semibold">{user.monomeName}</span>
                  <span className="text-xs text-gray-500">
                    {user.binomeName}
                  </span>
                </div>

                {/* Priority */}
                <div className="text-xs text-purple-600 font-semibold">
                  Priority: {user.priorityLevel}
                </div>

                {/* Button */}
                <button
                  onClick={() => acceptBinome([user.monome, user.binome])}
                  className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs"
                >
                  Accept
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">No users found.</p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3">
          <button
            onClick={() => setIsAcceptPfaDialogOpen(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-indigo-600 py-2 px-4 text-sm text-white transition-all hover:bg-indigo-500"
            type="button"
            onClick={() => {
              setShowSuccessToast(true);
              setTimeout(() => {
                setShowSuccessToast(false);
                setIsAcceptPfaDialogOpen(false); // Fermer le popup après un petit moment
              }, 2000);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
      {showSuccessToast && (
        <div className="fixed top-6 right-6 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg shadow-lg z-[9999] transition-opacity duration-300">
          ✅ Confirmation successful!
        </div>
      )}
    </div>
  );
}
