import { useParams } from "react-router-dom";
import { books } from "../books";
import { useCart } from "../context/CartContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const BookDetails = () => {
  const { addToCart } = useCart();
  const { id } = useParams();

  const book = books.find((b) => b.id === Number(id));

  if (!book) {
    return <div>کتاب پیدا نشد</div>;
  }

  return (
    <div dir="rtl">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <img
          src={book.image}
          alt={book.title}
          className="rounded-lg shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

          <p className="text-gray-600 mb-2">نویسنده: {book.author}</p>

          <p className="text-xl text-blue-600 font-bold mb-4">
            {book.price} تومان
          </p>

          <p className="text-gray-700 leading-7">{book.description}</p>

          <button
            onClick={() => addToCart(book)}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            افزودن به سبد خرید
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
