import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toPersianNumber } from "../utils/toPersianNumbers";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const BookDetails = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);

  const { addToCart, increaseQuantity, decreaseQuantity, getItemQuantity } =
    useCart();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/books/${id}`,
        );

        const fetchedBook = response.data.book;
        setBook(fetchedBook);

        // گرفتن کتاب‌های مرتبط
        const relatedResponse = await axios.get(
          `http://localhost:3000/api/books`,
          {
            params: {
              categoryId: fetchedBook.categoryId,
              limit: 4,
            },
          },
        );

        const filteredRelated = relatedResponse.data.books.filter(
          (b) => b.id !== fetchedBook.id,
        );

        setRelatedBooks(filteredRelated);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return <div className="text-center py-20">در حال بارگذاری...</div>;
  }

  const quantity = getItemQuantity(book.id);

  return (
    <div dir="rtl">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow">
          {/* تصویر */}
          <div className="flex justify-center">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-72 md:w-96 rounded-lg shadow"
            />
          </div>

          {/* اطلاعات */}
          <div className="text-right">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

            <p className="text-gray-600 mb-2">نویسنده: {book.author}</p>

            <p className="text-sm text-gray-500 mb-4">
              دسته‌بندی: {book.categoryName || "نامشخص"}
            </p>

            <div className="space-y-2 text-sm text-gray-700 mb-6">
              {book.translator && (
                <p>
                  مترجم: <span className="font-medium">{book.translator}</span>
                </p>
              )}

              <p>
                ناشر: <span className="font-medium">{book.publisher}</span>
              </p>

              <p>
                ISBN: <span className="font-medium">{book.ISBN}</span>
              </p>

              <p>
                وضعیت:
                {book.stock > 0 && book.isAvailable ? (
                  <span className="text-green-600 font-medium mr-1">موجود</span>
                ) : (
                  <span className="text-red-600 font-medium mr-1">ناموجود</span>
                )}
              </p>
            </div>

            {/* قیمت */}
            <div className="mb-6">
              <span className="text-2xl font-bold text-indigo-600">
                {toPersianNumber(book.price)} تومان
              </span>
            </div>

            {/* سبد خرید */}
            <div className="mt-4">
              {book.stock <= 0 || !book.isAvailable ? (
                <button
                  disabled
                  className="bg-gray-300 text-gray-600 px-6 py-3 rounded cursor-not-allowed"
                >
                  ناموجود
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={() => addToCart(book)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
                >
                  افزودن به سبد خرید
                </button>
              ) : (
                <div className="flex items-center gap-4 bg-gray-100 rounded px-4 py-2 w-fit">
                  <button
                    onClick={() => decreaseQuantity(book.id)}
                    className="text-xl font-bold px-2"
                  >
                    −
                  </button>

                  <span className="font-bold text-lg min-w-[30px] text-center">
                    {toPersianNumber(quantity)}
                  </span>

                  <button
                    onClick={() => increaseQuantity(book.id)}
                    className="text-xl font-bold px-2"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* توضیحات */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">درباره کتاب</h2>

          <p className="text-gray-700 leading-8 text-justify">
            {book.description}
          </p>
        </div>

        {/* مرتبط */}
        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">کتاب‌های مرتبط</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedBooks.map((related) => (
                <Link key={related.id} to={`/book/${related.id}`}>
                  <div className="bg-white p-3 rounded shadow hover:shadow-lg transition text-right">
                    <img
                      src={related.coverImage}
                      alt={related.title}
                      className="h-40 w-full object-cover rounded mb-3"
                    />

                    <h3 className="text-sm font-bold line-clamp-2">
                      {related.title}
                    </h3>

                    <p className="text-indigo-600 font-medium mt-2 text-sm">
                      {toPersianNumber(related.price)} تومان
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
