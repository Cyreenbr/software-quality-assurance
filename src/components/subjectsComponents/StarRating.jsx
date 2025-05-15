import { FaStar } from "react-icons/fa";

const StarRating = ({ value, onChange }) => {
    const handleClick = (star) => {
        if (value === star) {
            onChange(0); // reset to 0 if clicking the same star
        } else {
            onChange(star);
        }
    };

    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    className="focus:outline-none"
                >
                    <FaStar
                        size={24}
                        className={`transition ${value >= star ? "fill-yellow-400" : "fill-gray-300"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;
