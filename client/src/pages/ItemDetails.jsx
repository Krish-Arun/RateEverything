import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getItem, addReview, deleteReview } from "../api/items";
import RatingStars from "../components/RatingStars";
import { AuthContext } from "../context/AuthContext";

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // Load item once
  useEffect(() => {
    getItem(id).then((data) => setItem(data));
  }, [id]);

  // Submit new review
  const submitReview = async () => {
    if (!rating || !review.trim()) {
      alert("Enter rating + review text");
      return;
    }

    await addReview(id, {
      username: user,
      rating,
      review,
    });

    const updated = await getItem(id);
    setItem(updated);

    setRating(0);
    setReview("");
  };

  // Delete a specific review
  const handleDelete = async (reviewId) => {
    await deleteReview(item._id, reviewId);
    const updated = await getItem(id);
    setItem(updated);
  };

  if (!item) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">

      {/* Item name */}
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>

      {/* Image (16:9) */}
      {item.imageUrl && (
        <div className="w-full aspect-video mb-6">
          <img
            src={item.imageUrl}
            alt="item"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <p className="text-gray-300 mb-2">Category: {item.category}</p>

      <p className="text-yellow-400 mb-8 text-lg">
        ⭐ Avg Rating: {item.averageRating?.toFixed(1) || "No ratings yet"}
      </p>

      {/* Review form */}
      <div className="p-4 bg-gray-800 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>

        <RatingStars rating={rating} setRating={setRating} />

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full mt-3 p-3 rounded bg-gray-900 border border-gray-700 text-white"
          placeholder="Write your thoughts..."
          rows="3"
        />

        <button
          onClick={submitReview}
          className="mt-3 bg-blue-500 px-5 py-2 rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </div>

      {/* Reviews list */}
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

      {item.reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {item.reviews.map((r) => (
            <div key={r._id} className="p-4 bg-gray-800 rounded-lg">

              {/* Header row: username + rating */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-300">{r.username}</span>
                <span className="text-yellow-400">⭐ {r.rating}</span>
              </div>

              <p className="mt-2 text-gray-200">{r.review}</p>

              {/* DELETE OWN REVIEW */}
              {user === r.username && (
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-red-400 text-sm mt-2 hover:text-red-500"
                >
                  Delete review
                </button>
              )}

              {/* Judgement block */}
              {r.judgement && (
                <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <p className="text-pink-400 font-semibold">
                    📢 {r.judgement.judgementText}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.judgement.judgementTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}