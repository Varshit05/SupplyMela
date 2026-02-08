import { FiStar } from "react-icons/fi";

const StarRating = ({ rating = 0, size = 18 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;

        return (
          <div key={star} className="relative inline-block" style={{ width: size, height: size }}>
            {/* Background Layer: Empty Star with light fill */}
            <FiStar
              size={size}
              fill="#f8fafc" // slate-50
              className="text-slate-200 absolute top-0 left-0"
            />

            {/* Foreground Layer: Solid Yellow Star with clipping */}
            <div
              className="absolute top-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${fillPercentage}%` }}
            >
              <FiStar 
                size={size} 
                fill="#fbbf24" // amber-400 (Solid Yellow)
                className="text-amber-400" 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;