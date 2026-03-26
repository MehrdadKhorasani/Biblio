import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useState } from "react";

export default function FAQ() {
  const [answerVisible, setAnswerVisible] = useState(Array(9).fill(false));

  const toggleAnswer = (index) => {
    setAnswerVisible((prev) => {
      const newVisible = [...prev];
      newVisible[index] = !newVisible[index];
      return newVisible;
    });
  };
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            سوالات متداول
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            پاسخ به رایج‌ترین سوالات کاربران بیبلیو در این بخش گردآوری شده است.
          </p>
        </section>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-4">
            {/* سوال 1 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(0)}
              >
                چگونه می‌توانم در بیبلیو ثبت‌نام کنم؟
              </button>
              {answerVisible[0] && (
                <div className="p-4 border-t border-gray-200">
                  برای ثبت‌نام، کافیست روی دکمه "ثبت‌نام" در صفحه اصلی کلیک کرده
                  و اطلاعات مورد نیاز را وارد کنید.
                </div>
              )}
            </li>

            {/* سوال 2 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(1)}
              >
                روش‌های پرداخت در بیبلیو کدامند؟
              </button>
              {answerVisible[1] && (
                <div className="p-4 border-t border-gray-200">
                  ما از روش‌های پرداخت متنوعی از جمله کارت‌های بانکی، درگاه
                  پرداخت امن و کیف پول‌های الکترونیکی پشتیبانی می‌کنیم.
                </div>
              )}
            </li>

            {/* سوال 3 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(2)}
              >
                هزینه ارسال کتاب چقدر است؟
              </button>
              {answerVisible[2] && (
                <div className="p-4 border-t border-gray-200">
                  هزینه ارسال کتاب بسته به وزن و مقصد متفاوت است. می‌توانید در
                  صفحه سبد خرید، هزینه دقیق ارسال را مشاهده کنید.
                </div>
              )}
            </li>

            {/* سوال 4 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(3)}
              >
                چه مدت طول می‌کشد تا سفارش من به دستم برسد؟
              </button>
              {answerVisible[3] && (
                <div className="p-4 border-t border-gray-200">
                  زمان رسیدن سفارش شما به مقصد بستگی به نوع ارسال و موقعیت مکانی
                  شما دارد. معمولاً بین 3 تا 7 روز کاری طول می‌کشد.
                </div>
              )}
            </li>

            {/* سوال 5 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(4)}
              >
                اگر کتابی که سفارش داده‌ام موجود نباشد چه اتفاقی می‌افتد؟
              </button>
              {answerVisible[4] && (
                <div className="p-4 border-t border-gray-200">
                  در صورت عدم موجودی کتاب، به شما اطلاع داده می‌شود و می‌توانید
                  سفارش خود را لغو یا جایگزین کنید.
                </div>
              )}
            </li>

            {/* سوال 6 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(5)}
              >
                چگونه می‌توانم سفارش خود را پیگیری کنم؟
              </button>
              {answerVisible[5] && (
                <div className="p-4 border-t border-gray-200">
                  پس از ثبت سفارش، یک کد پیگیری برای شما ارسال می‌شود که
                  می‌توانید با استفاده از آن وضعیت سفارش خود را در صفحه پیگیری
                  سفارش پیگیری کنید.
                </div>
              )}
            </li>

            {/* سوال 7 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(6)}
              >
                سیاست مرجوعی بیبلیو چیست؟
              </button>
              {answerVisible[6] && (
                <div className="p-4 border-t border-gray-200">
                  در صورت نارضایتی از کتاب خریداری شده، می‌توانید ظرف 7 روز پس
                  از دریافت، آن را با ارائه رسید خرید مرجوع کنید.
                </div>
              )}
            </li>

            {/* سوال 8 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(7)}
              >
                آیا می‌توانم کتاب‌های دست دوم نیز سفارش دهم؟
              </button>
              {answerVisible[7] && (
                <div className="p-4 border-t border-gray-200">
                  در حال حاضر، بیبلیو فقط کتاب‌های نو را ارائه می‌دهد.
                </div>
              )}
            </li>

            {/* سوال 9 */}
            <li>
              <button
                className="w-full text-right font-semibold py-2 px-4 rounded hover:bg-gray-100"
                onClick={() => toggleAnswer(8)}
              >
                چگونه می‌توانم از تخفیف‌ها و پیشنهادات ویژه بیبلیو مطلع شوم؟
              </button>
              {answerVisible[8] && (
                <div className="p-4 border-t border-gray-200">
                  می‌توانید با ثبت‌نام در خبرنامه بیبلیو و دنبال کردن ما در
                  شبکه‌های اجتماعی از تخفیف‌ها و پیشنهادات ویژه مطلع شوید.
                </div>
              )}
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
