import React from "react";

const StatusBadge = ({ status }) => {
  const badgeColor =
    status === "Shipped"
      ? "bg-blue-500 text-white ring-blue-500/30" // Blue background and white text for Shipped
      : status === "Quick Quote"
      ? " bg-custom-blue1 text-white ring-teal-500/30" // Teal background and white text for Quick Quote
      : status === "Processing"
      ? "bg-orange-500 text-white ring-orange-500/30" // Orange background and white text for Processing
      : status === "Initial Design"
      ? "bg-[#ff9c68] text-white ring-[#ff9c68]" // Indigo background and white text for Initial Design
      : status === "Initial Measurements"
      ? "bg-custom-LavenderBlush text-white ring-custom-LavenderBlush" // Indigo background and white text for Initial Measurement
      : status.startsWith("Revised Design")
      ? "bg-custom-indigo text-white ring-purple-500/30" // Purple background and white text for Revised Design
      : status === "Final Measurement"
      ? "bg-custom-Brown text-white ring-gray-500/30" // Gray background and white text for Final Measurement
      : status === "SignUp Document"
      ? "bg-gray-500 text-white ring-gray-500/30" // Gray background and white text for SignUp Document
      : status.startsWith("Production")
      ? "bg-[#a283ff] text-white ring-[#a283ff]" // Gray background and white text for Production
      : status === "PDI"
      ? "bg-pink-500 text-white ring-pink-500/30" // Pink background and white text for PDI
      : status === "Dispatch"
      ? "bg-teal-500 text-white ring-teal-500/30" // Teal background and white text for Dispatch
      : status === "Installation"
      ? "bg-[#ffad58] text-white ring-[#ffad58]" // Cyan background and white text for Installation
      : status === "Completion"
      ? "bg-green-500 text-white ring-green-500/30" // Green background and white text for Completed
      : status === "Cancelled"
      ? "bg-red-500 text-white ring-red-500/30" // Red background and white text for Cancelled
      : "bg-gray-500 text-white ring-gray-500/30"; // Default color for any undefined status

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full w-32 h-8 text-xs font-semibold ring-1 ring-inset ${badgeColor}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
