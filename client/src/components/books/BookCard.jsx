import { toPersianNumber } from "../../utils/toPersianNumbers";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const { addToCart, increaseQuantity, decreaseQuantity, getItemQuantity } =
    useCart();
  const quantity = getItemQuantity(book.id);

  return (
    <Link to={`/book/${book.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-60 object-cover"
        />

        <div className="p-4 text-right">
          <h3 className="font-bold text-lg mb-1">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>

          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-blue-600">
              {toPersianNumber(book.price.toLocaleString())} تومان
            </span>

            <div className="mt-3">
              {quantity === 0 ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(book);
                  }}
                  className="w-full text-sm bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-600 font-medium"
                >
                  افزودن به سبد
                </button>
              ) : (
                <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-1 py-1 gap-1 sm:px-2 sm:gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      decreaseQuantity(book.id);
                    }}
                    className="w-7 h-7 flex items-center justify-center bg-white border rounded-md hover:bg-red-100 transition text-sm"
                  >
                    −
                  </button>

                  <span className="min-w-[18px] text-center font-bold text-blue-700 text-sm">
                    {toPersianNumber(quantity)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      increaseQuantity(book.id);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border rounded-md hover:bg-green-100 transition text-sm"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
