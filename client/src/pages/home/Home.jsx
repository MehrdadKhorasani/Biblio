import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../../components/layout/Header";
import Hero from "../../components/home/Hero";
import Footer from "../../components/layout/Footer";
import CategorySection from "../../components/categories/CategorySection";
import BookList from "../../components/books/BookList";
import { toPersianNumber } from "../../utils/toPersianNumbers";

const ITEMS_PER_PAGE = 4;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/books", {
          params: {
            categoryId: selectedCategory,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
        });

        setBooks(response.data.books);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [selectedCategory, currentPage]);

  return (
    <div>
      <Header />
      <Hero />

      <CategorySection
        selectedCategory={selectedCategory}
        setSelectedCategory={(id) => {
          setSelectedCategory(id);
          setCurrentPage(1);
        }}
      />

      <BookList books={books} />

      <div className="flex justify-center mt-8 gap-2" dir="rtl">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {toPersianNumber(index + 1)}
          </button>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
