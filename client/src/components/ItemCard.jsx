import RatingStars from "./RatingStars";
import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  return (
    <Link
      to={`/item/${item._id}`}
      className="border p-4 rounded-lg shadow hover:shadow-lg transition"
    >
      <h2 className="font-bold text-lg">{item.name}</h2>
      <p className="text-sm text-gray-600">{item.category}</p>
      <RatingStars rating={item.rating} />
    </Link>
  );
}
