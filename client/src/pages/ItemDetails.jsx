import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RatingStars from "../components/RatingStars";
import { getItem, rateItem } from "../api/items";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    getItem(id).then(setItem);
  }, [id]);

  if (!item) return <>Loading...</>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{item.name}</h1>
      <p className="text-gray-500">{item.category}</p>

      <div className="mt-4">
        <RatingStars rating={item.rating} />
      </div>

      <button
        className="mt-4 px-3 py-2 bg-black text-white rounded"
        onClick={() => rateItem(id, item.rating + 1)}
      >
        Rate +1
      </button>
    </div>
  );
}
