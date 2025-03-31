const PeriodCard = ({ period, onEdit }) => {
    return (
      <div className="p-4 bg-gray-100 text-gray-800 shadow-lg rounded-lg flex justify-between items-center transition transform hover:scale-105">
        <div>
          <h3 className="font-semibold text-blue-700">{period.type.replace(/_/g, " ")}</h3>
          <p>{new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}</p>
        </div>
        <button
          onClick={() => onEdit(period)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 shadow-md transition"
        >
          Modifier
        </button>
      </div>
    );
  };
  
  export default PeriodCard;
  