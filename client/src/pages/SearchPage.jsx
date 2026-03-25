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
  console.log(queryParams);
  useEffect(() => {
    fetchBooks({ search }).then((result) => {
      setBooks(result.books);
    });
  }, [search]);

  if (!search) {
    return <div>No Result</div>;
  }

  console.log("Hallo", books);
  return (
    <div>
      <Header />
      <section className="py-10 mx-28" dir="rtl">
        <h2 className="text-2xl font-bold mb-6 text-right">کتاب‌ها</h2>

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
