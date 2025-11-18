import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ItemCard from "../components/ItemCard";
import { getAllItems } from "../api/items";

export default function Home() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllItems().then(setItems);
  }, []);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4">
      <SearchBar value={query} onChange={setQuery} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(item => <ItemCard key={item._id} item={item} />)}
      </div>
    </div>
  );
}
