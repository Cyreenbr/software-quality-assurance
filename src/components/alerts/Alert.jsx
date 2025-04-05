import React, { forwardRef } from "react";

const Alert = forwardRef(({ type, message, ...props }, ref) => {
  let alertStyles;
  switch (type) {
    case "success":
      alertStyles = "bg-green-500 text-white border-green-700";
      break;
    case "error":
      alertStyles = "bg-red-500 text-white border-red-700";
      break;
    case "info":
      alertStyles = "bg-blue-500 text-white border-blue-700";
      break;
    case "warning":
      alertStyles = "bg-yellow-500 text-black border-yellow-700";
      break;
    default:
      alertStyles = "bg-blue-500 text-white border-blue-700";
  }

  return (
    <div
      ref={ref}
      {...props}
      className={`flex items-center p-4 mb-4 border-l-4 rounded-md shadow-md ${alertStyles}`}
    >
      <div className="mr-3">
        {type === "success" && "✔️"}
        {type === "error" && "❌"}
        {type === "info" && "ℹ️"}
        {type === "warning" && "⚠️"}
      </div>

      {/* Message */}
      <span className="flex-grow">{message}</span>
    </div>
  );
});

Alert.displayName = "Alert";

export default Alert;
