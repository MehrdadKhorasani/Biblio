import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function ContactUs() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">تماس با ما</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            برای هرگونه سوال، پیشنهاد یا انتقاد، با ما در تماس باشید.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* اطلاعات تماس */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              اطلاعات تماس
            </h2>
            <p className="text-gray-600 mb-4">آدرس: [آدرس شرکت]</p>
            <p className="text-gray-600 mb-4">تلفن: [شماره تلفن]</p>
            <p className="text-gray-600 mb-4">ایمیل: [آدرس ایمیل]</p>
            <p className="text-gray-600 mb-4">ساعات کاری: [ساعات کاری]</p>
            <p className="text-gray-600">
              شبکه‌های اجتماعی:
              <a href="#" className="text-blue-500 ml-2 hover:underline">
                اینستاگرام
              </a>
              <a href="#" className="text-blue-500 ml-2 hover:underline">
                لینکدین
              </a>
            </p>
          </div>

          {/* فرم تماس */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ارسال پیام
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500"
                  placeholder="نام و نام خانوادگی خود را وارد کنید"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  ایمیل
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500"
                  placeholder="آدرس ایمیل خود را وارد کنید"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  پیام
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500"
                  placeholder="پیام خود را اینجا بنویسید"
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled
              >
                ارسال پیام
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
