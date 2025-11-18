import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import ItemDetails from "./pages/ItemDetails";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Navbar />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
