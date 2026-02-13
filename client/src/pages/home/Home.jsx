import { useState } from "react";

import Header from "../../components/layout/Header";
import Hero from "../../components/home/Hero";
import Footer from "../../components/layout/Footer";
import CategorySection from "../../components/categories/CategorySection";
import BookList from "../../components/books/BookList";
import { books } from "../../mock/books";

import { toPersianNumber } from "../../utils/toPersianNumbers";

const ITEMS_PER_PAGE = 4;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBooks = selectedCategory
    ? books.filter((b) => Number(b.categoryId) === Number(selectedCategory))
    : books;

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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

      <BookList books={paginatedBooks} />
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
