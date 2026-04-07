import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/categories",
        );

        const activeCategories = response.data.categories.filter(
          (cat) => cat.isActive,
        );

        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <div>
        <div className="m-auto w-1/3 mt-32 mb-32">
          {categories.map((cat) => (
            <div
              className="p-4 font-semibold text-center mt-3 mb-4 hover:border-2"
              key={cat.id}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
