import { Star } from "lucide-react";

const StarRating = ({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star
            className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
          />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star
              className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
            />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        />
      );
    }
  }

  return <div className="flex items-center space-x-1">{stars}</div>;
};

export default StarRating;
