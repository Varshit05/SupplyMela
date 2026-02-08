import { FiStar } from "react-icons/fi";

const FractionalRating = ({ rating, size = 14 }) => {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const fillPercentage = Math.min(Math.max(rating - (s - 1), 0), 1) * 100;

        return (
          <div key={s} className="relative inline-block" style={{ width: size, height: size }}>
            {/* Background Layer: The "Empty" Star (Slate Outline + Light Gray Fill) */}
            <FiStar 
              size={size} 
              fill="#f8fafc" // This is slate-50 (matches your original)
              className="text-slate-200 absolute top-0 left-0" 
            />
            
            {/* Foreground Layer: The "Filled" Yellow Star */}
            <div 
              className="absolute top-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${fillPercentage}%` }}
            >
              <FiStar 
                size={size} 
                fill="#fbbf24" // This is amber-400 (Solid Yellow)
                className="text-amber-400" 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FractionalRating;