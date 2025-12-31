import { Star } from "lucide-react";

const StarRating = ({
  rating,
  maxStars = 5,
  onRate,
  readonly = false,
  size = 20,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFull = rating >= starValue;
        const isHalf = rating >= starValue - 0.5 && !isFull;

        return (
          <button
            key={index}
            onClick={() => !readonly && onRate && onRate(starValue)}
            disabled={readonly}
            className={`${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } transition-transform focus:outline-none`}
            type="button"
          >
            <Star
              size={size}
              className={`${
                isFull || isHalf
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } stroke-current`}
              strokeWidth={isFull ? 0 : 2}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
