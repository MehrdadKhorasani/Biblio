import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { toPersianNumber } from "../utils/toPersianNumbers";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div dir="rtl">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">سبد خرید شما خالی است.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-4 rounded shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-24 object-cover rounded"
                    />

                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-gray-600 text-sm">
                        تعداد: {toPersianNumber(item.quantity)}
                      </p>
                      <p className="text-blue-600 font-bold">
                        {toPersianNumber(item.price)} تومان
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-gray-100 p-6 rounded shadow">
              <div className="flex justify-between mb-4 text-lg font-bold">
                <span>جمع کل:</span>
                <span>{toPersianNumber(totalPrice)} تومان</span>
              </div>

              <button className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600">
                ادامه فرآیند خرید
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-3 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
              >
                خالی کردن سبد
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
