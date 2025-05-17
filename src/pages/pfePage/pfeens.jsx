import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { choosePfe, getPfeList } from "../../services/pfeService/pfe.service";

const TeacherPFEList = () => {
  const [pfeList, setPfeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const storedUser = useSelector((state) => state.auth.user);
  const loggedInUser = storedUser?._id || storedUser?.id;

  const fetchPFEs = async () => {
    setLoading(true);
    try {
      const data = await getPfeList();
      setPfeList(data);
    } catch (error) {
      toast.error(` ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePFE = async (id) => {
    try {
      await choosePfe(id);
      toast.success("Subject chosen successfully!");
      fetchPFEs();
    } catch (error) {
      toast.error(` ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchPFEs();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
        PFE Subjects List
      </h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading PFE subjects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pfeList.map((pfe) => {
            const isSupervisor = loggedInUser === pfe.IsammSupervisor?._id;
            const status = pfe.status;

            let borderColorClass = "border-gray-200";
            let badgeColorClass = "";
            let badgeText = "";

            if (isSupervisor) {
              if (status === "approved") {
                borderColorClass = "border-emerald-500 bg-emerald-50";
                badgeColorClass = "bg-emerald-500";
                badgeText = "Approved";
              } else if (status === "rejected") {
                borderColorClass = "border-rose-500 bg-rose-50";
                badgeColorClass = "bg-rose-500";
                badgeText = "Rejected";
              } else {
                borderColorClass = "border-amber-500 bg-amber-50";
                badgeColorClass = "bg-amber-500";
                badgeText = "Pending";
              }
            }

            return (
              <div
                key={pfe._id}
                className={`relative border-2 rounded-xl shadow-md hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 p-6 bg-white hover:shadow-lg transition-all duration-300 ${borderColorClass}`}
              >
                {isSupervisor && (
                  <span
                    className={`absolute -top-3 right-4 hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100  text-white text-xs py-1 px-3 rounded-full shadow-md ${badgeColorClass}`}
                  >
                    {badgeText}
                  </span>
                )}

                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  {pfe.title}
                </h3>
                <p className="mb-4 text-gray-600 italic">
                  {pfe.description || "No description available"}
                </p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-start">
                    <span className="font-medium text-gray-500 w-28">Domain:</span>
                    <span className="text-gray-700">{pfe.domain || "N/A"}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-gray-500 w-28">Company:</span>
                    <span className="text-gray-700">{pfe.company || "N/A"}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-gray-500 w-28">Technologies:</span>
                    <span className="text-gray-700">
                      {pfe.technologies?.join(", ") || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-gray-500 w-28">Student:</span>
                    <span className="text-gray-700">
                      {pfe.student
                        ? `${pfe.student.firstName} ${pfe.student.lastName}`
                        : "Not assigned"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-gray-500 w-28">Assignment visible:</span>
                    <span className="text-gray-700">
                      {pfe.isAssignmentVisible ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-gray-500 w-28">Defense visible:</span>
                    <span className="text-gray-700">
                      {pfe.isDefenseVisible ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {pfe.IsammSupervisor ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-3">
                      {isSupervisor ? (
                        <span className="text-emerald-600">Assigned to you</span>
                      ) : (
                        <span className="text-gray-600">
                          Assigned to: {pfe.IsammSupervisor.firstName}{" "}
                          {pfe.IsammSupervisor.lastName}
                        </span>
                      )}
                    </p>
                    <button
                      className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Subject already chosen
                    </button>
                  </div>
                ) : (
                  <button

                    className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                    onClick={() => handleChoosePFE(pfe.pfeId)}

                  >
                    Choose this subject
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherPFEList;