import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const OrderSuccess = () => {
  return (
    <div dir="rtl">
      <Header />

      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          سفارش شما با موفقیت ثبت شد 🎉
        </h1>

        <p className="text-gray-600 mb-8">
          همکاران ما در سریع‌ترین زمان ممکن سفارش شما را بررسی خواهند کرد.
        </p>

        <Link
          to="/"
          className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
