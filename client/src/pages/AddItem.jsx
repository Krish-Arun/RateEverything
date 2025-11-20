import { useState } from "react";
import { addItem } from "../api/items";
import Particles from "@/components/Particles";

export default function AddItem() {
  const [data, setData] = useState({
    name: "",
    category: "",
    imageUrl: "",
  });

  const [success, setSuccess] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    addItem(data)
      .then(() => {
        setSuccess("Item added successfully!");
        setData({ name: "", category: "", imageUrl: "" });
      })
      .catch(() => alert("Something went wrong"));
  }

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
  
      {/* ABSOLUTE BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={220}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={110}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>
  
      {/* FOREGROUND FLEX CENTER */}
      <div className="flex items-center justify-center min-h-screen px-4">
  
        {/* THE CARD */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-black/60 backdrop-blur-xl 
            p-10 rounded-2xl shadow-xl 
            w-full max-w-md 
            border border-white/10 
            space-y-6
          "
        >
          <h1 className="text-3xl font-bold text-center mb-4">
            Add New Item
          </h1>
  
          {success && (
            <p className="text-green-400 text-center text-sm">{success}</p>
          )}
  
          <input
            type="text"
            placeholder="Image URL (Optional)"
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white"
            value={data.imageUrl}
            onChange={(e) =>
              setData({ ...data, imageUrl: e.target.value })
            }
          />
  
          <input
            type="text"
            placeholder="Item Name"
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white"
            value={data.name}
            onChange={(e) =>
              setData({ ...data, name: e.target.value })
            }
            required
          />
  
          <input
            type="text"
            placeholder="Category"
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white"
            value={data.category}
            onChange={(e) =>
              setData({ ...data, category: e.target.value })
            }
            required
          />
  
          <button
            type="submit"
            className="
              w-full 
              bg-white text-black 
              hover:bg-gray-300 
              px-4 py-3 rounded-xl 
              text-lg font-semibold 
              transition
            "
          >
            Add Item
          </button>
        </form>
      </div>
  
    </div>
  );

}
