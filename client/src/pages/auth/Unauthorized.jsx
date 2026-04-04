import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

const Unauthorized = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <h1 className="text-xl text-red-600">
          شما اجازه دسترسی به این صفحه را ندارید
        </h1>
      </div>
      <Footer />
    </>
  );
};

export default Unauthorized;
