import { faCalendarAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PeriodCard = ({ period, onEdit }) => {
  const today = new Date();
  const endDate = new Date(period.end);
  const isActive = today <= endDate;

  return (
    <div className="relative p-6 bg-white text-gray-900 shadow-lg rounded-2xl flex items-center justify-between transition transform hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r from-blue-50 to-purple-100 border border-gray-200">
      <div>
        <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
          {period.type.replace(/_/g, " ")}
        </h3>
        <p className="text-gray-600 mt-2 font-medium">
          {new Date(period.start).toLocaleDateString()} - {endDate.toLocaleDateString()}
        </p>
        <p className={`mt-2 font-semibold ${isActive ? "text-green-600" : "text-red-600"}`}>
          {isActive ? "Valid" : "Expired"}
        </p>
      </div>
      <button
        onClick={() => onEdit(period)}
        className="bg-blue-400 text-white p-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-700"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
    </div>
  );
};

export default PeriodCard;
