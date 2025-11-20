import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { getItem, addReview, deleteReview } from "../api/items";
import RatingStars from "../components/RatingStars";
import { AuthContext } from "@/context/AuthContext";
import Particles from "@/components/Particles";

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    getItem(id).then((data) => setItem(data));
  }, [id]);

  const submitReview = async () => {
    if (!rating || !review.trim()) return alert("Enter rating & review");

    await addReview(id, { username: user, rating, review });

    const updated = await getItem(id);
    setItem(updated);

    setRating(0);
    setReview("");
  };

  const handleDeleteReview = async (rid) => {
    if (!confirm("Delete this review?")) return;

    await deleteReview(id, rid);

    const updated = await getItem(id);
    setItem(updated);
  };

  if (!item) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
    
      {/* Particle Background */}
      <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={110}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="relative z-10 max-w-7xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="space-y-8">

          {/* IMAGE CARD */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <div className="w-full aspect-video bg-black">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 p-4 bg-black/40 backdrop-blur-md">
              <h1 className="text-3xl font-bold">{item.name}</h1>
              <p className="text-gray-300">{item.category}</p>
            </div>
          </div>

          {/* REVIEW FORM */}
          <div className="bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-3">Leave a Review</h2>

            <RatingStars rating={rating} setRating={setRating} />

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your thoughts..."
              className="w-full mt-3 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white"
              rows={3}
            />

            <button
              onClick={submitReview}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
            >
              Submit Review
            </button>
          </div>

        </div>

        {/* RIGHT SIDE – REVIEWS */}
        <div className="bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-xl max-h-[80vh] overflow-y-auto">

          <h2 className="text-3xl font-semibold mb-6">Reviews</h2>

          {item.reviews.length === 0 && (
            <p className="text-gray-300">No reviews yet.</p>
          )}

          <div className="space-y-6">
            {item.reviews.map((r) => (
              <div
                key={r._id}
                className="p-4 bg-gray-800 rounded-xl border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-300">{r.username}</span>
                  <span className="text-yellow-400">⭐ {r.rating}</span>
                </div>

                <p className="mt-2 text-gray-200">{r.review}</p>

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

                {/* Delete button IF this user wrote it */}
                {user === r.username && (
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    className="mt-3 text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete review
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
