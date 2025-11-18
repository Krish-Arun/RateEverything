export default function RatingStars({ rating = 0 }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((n) => (
        <span key={n} className={n <= rating ? "text-yellow-400" : "text-gray-400"}>
          ★
        </span>
      ))}
    </div>
  );
}
