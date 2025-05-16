
const ProgressBar = ({ value, max, label = "Progress", color = "bg-blue-600", height = "h-2.5" }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-medium text-gray-700">
                    {value} of {max} processed
                </span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full ${height}`}>
                <div
                    className={`${color} ${height} rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
