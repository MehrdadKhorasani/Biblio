import { toPersianNumber } from "../../utils/toPersianNumbers";
const BookCard = ({ book }) => {
  return (
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

          <button
            className="bg-blue-500 text-white px-3 py-1 rounded
                       hover:bg-blue-600 transition text-sm"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
