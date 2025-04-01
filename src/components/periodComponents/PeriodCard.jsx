import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PeriodCard = ({ period, onEdit}) => {
  return (
    <div className={`p-4 bg-gray-100 text-gray-800 shadow-lg rounded-lg flex justify-between items-center transition transform hover:scale-105`}>
      <div>
        <h3 className="font-semibold text-blue-700">{period.type.replace(/_/g, " ")}</h3>
        <p>{new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}</p>
      </div>
        <button
          onClick={() => onEdit(period)}
          className="text-blue-500 text-xl hover:text-blue-700 transition"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>

    </div>
  );
};

export default PeriodCard;