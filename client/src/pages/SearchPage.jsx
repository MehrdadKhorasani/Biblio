import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useEffect, useState } from "react";
import { fetchBooks } from "../api/book.api";
import { useLocation } from "react-router-dom";
import BookCard from "../components/books/BookCard";

export default function SearchPage() {
  const [books, setBooks] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search");
  useEffect(() => {
    fetchBooks({ search }).then((result) => {
      setBooks(result.books);
    });
  }, [search]);

  if (!search) {
    return <div>No Result</div>;
  }

  return (
    <div>
      <Header />
      <section className="py-10 mx-28" dir="rtl">
        <h2 className="text-3xl font-bold mt-4 mb-8 text-right">
          لیست کتاب‌ها
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
