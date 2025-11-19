import { useEffect, useState } from "react";
import { getAllItems } from "../api/items";
import { Link } from "react-router-dom";

export default function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getAllItems().then((data) => {
      setItems(data);
      setFilteredItems(data);
    });
  }, []);

  const runSearch = (q, c) => {
    q = q.toLowerCase();
    c = c.toLowerCase();

    const results = items.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesReview = item.reviews.some((r) =>
        r.review.toLowerCase().includes(q)
      );
      const matchesCategory = item.category.toLowerCase().includes(c);

      return (matchesName || matchesReview) && matchesCategory;
    });

    setFilteredItems(results);
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">

      {/* Search section */}
      <div className="flex gap-4 mb-8">

        <input
          type="text"
          placeholder="Search items or reviews..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            runSearch(e.target.value, category);
          }}
          className="p-2 bg-gray-800 text-white rounded w-64"
        />

        <input
          type="text"
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            runSearch(query, e.target.value);
          }}
          className="p-2 bg-gray-800 text-white rounded w-48"
        />

      </div>

      {/* Items list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {filteredItems.length === 0 ? (
          <p className="text-gray-400 text-lg">No items found.</p>
        ) : (
          filteredItems.map((item) => (
            <Link
              to={`/item/${item._id}`}
              key={item._id}
              className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>

              <p className="text-gray-400">{item.category}</p>

              <p className="text-yellow-400 mt-2">
                ⭐ {item.averageRating?.toFixed(1) || "No ratings yet"}
              </p>
            </Link>
          ))
        )}

      </div>
    </div>
  );
}
