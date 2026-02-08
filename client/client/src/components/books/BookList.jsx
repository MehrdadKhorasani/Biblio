import { books } from "../../books";
import BookCard from "./BookCard";

const BookList = () => {
  return (
    <section className="py-10 mx-28" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-right">جدیدترین کتاب‌ها</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default BookList;
