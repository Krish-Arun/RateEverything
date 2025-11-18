import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        RateEverything
      </Link>
      <div className="flex gap-4">
        <Link to="/add">Add Item</Link>
      </div>
    </nav>
  );
}
