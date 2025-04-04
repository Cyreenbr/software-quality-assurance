import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";

export default function AcceptPfaPopUp({ pfaPriority, pfaId ,isAcceptPfaDialogOpen}) {
  const [updatedPfaPriority, setUpdatedPfaPriority] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const acceptBinome = async (data) => {
    console.log(pfaId, data, "this is fuuction");
    const response = await pfaService.acceptBinome(pfaId, data);
    console.log(response);
  };

  const fetchStudents = async () => {
    try {
      const response = await pfaService.getStudents();

      if (!response || !Array.isArray(response.model)) {
        throw new Error("The API did not return an array of students.");
      }

      // Map student IDs to names for quick lookup
      const studentMap = new Map(
        response.model.map((student) => [student._id, student.firstName])
      );
      // Update each PFA with student names
      setUpdatedPfaPriority(
        pfaPriority.map((pfa) => ({
          ...pfa,
          monomeName: studentMap.get(pfa.monome) || "Unknown",
          binomeName: studentMap.get(pfa.binome) || "Unknown",
        }))
      );
      console.log(updatedPfaPriority); // Check if names are correctly assigned
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  return (
    isAcceptPfaDialogOpen && ( // Condition pour afficher le popup si isDialogOpen est true
      <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
        <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
          <div className="relative flex flex-col bg-white">
            <div className="relative m-2 items-center flex justify-center text-white h-12 rounded-md bg-indigo-600 px-4">
              <h3 className="text-lg font-semibold">Select a User</h3>
            </div>

            <div className="flex flex-col gap-2 p-6 max-h-[300px] overflow-y-auto">
              {updatedPfaPriority.length > 0 ? (
                updatedPfaPriority.map((user) => (
                  <div className=" flex gap-2 " key={user.monome}>
                    <p>{user.monomeName}</p>
                    <p>{user.binomeName}</p>
                    <p>{user.priorityLevel}</p>
                    <button
                      onClick={() => acceptBinome([user.monome, user.binome])}
                      className=" bg-green-600 px-2 rounded-md text-white "
                    >
                      accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  No users found.
                </p>
              )}
            </div>

            <div className="p-6 pt-0 flex justify-between">
              <button
                className="rounded-md bg-indigo-600 py-2 px-4 text-sm text-white transition-all hover:bg-indigo-500"
                type="button"
              >
                Confirm
              </button>
              <button
                className="rounded-md bg-gray-400 py-2 px-4 text-sm text-white"
                type="button"
                onClick={() => isAcceptPfaDialogOpen(false)} // Ferme le popup en cliquant sur Cancel
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
