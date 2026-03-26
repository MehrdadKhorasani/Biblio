import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function AboutUs() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">درباره ما</h1>
          <p className="text-gray-600 mt-8 text-lg leading-relaxed text-right">
            ما در بیبلیو، با هدف توسعه دسترسی تاسیس شده‌ایم. با تکیه بر
            [ارزش‌های اصلی شرکت]، تلاش می‌کنیم تا [تعهدات شرکت به مشتریان و
            جامعه] را به بهترین شکل ممکن انجام دهیم. تیم ما متشکل از متخصصان
            مجرب و خلاق است که با شور و اشتیاق به دنبال ارائه راه‌حل‌های
            نوآورانه برای چالش‌های [حوزه فعالیت شرکت] هستیم. ما به دنبال ایجاد
            یک محیط کاری مثبت و پویا هستیم که در آن همه اعضا بتوانند به رشد و
            شکوفایی خود بپردازند.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* کارت 1: تاریخچه شرکت */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              تاریخچه ما
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              داستان ما از [سال تاسیس] آغاز شد، زمانی که [تاسیس‌کنندگان] تصمیم
              گرفتند تا [ایده اولیه]. در ابتدا، ما بر روی [محصولات/خدمات اولیه]
              تمرکز داشتیم و به تدریج با گسترش فعالیت‌ها، به [محصولات/خدمات
              فعلی] رسیدیم. در طول این سال‌ها، ما با چالش‌های بسیاری روبرو
              شده‌ایم، اما با پشتکار و تلاش، توانسته‌ایم بر آن‌ها غلبه کنیم و به
              یک شرکت پیشرو در [صنعت] تبدیل شویم.
            </p>
          </div>

          {/* کارت 2: ماموریت و چشم‌انداز */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ماموریت و چشم‌انداز
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              ماموریت ما این است که [ماموریت شرکت به طور دقیق]. ما به دنبال این
              هستیم که [چگونه ماموریت را انجام می‌دهید]. چشم‌انداز ما این است که
              [چشم‌انداز شرکت در آینده]. ما می‌خواهیم [به چه چیزی دست پیدا
              کنید].
            </p>
          </div>

          {/* کارت 3: تیم ما */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">تیم ما</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              تیم ما از افراد با استعداد و متعهد تشکیل شده است که هر کدام در
              زمینه تخصصی خود خبره هستند. ما به همکاری تیمی و تبادل دانش اهمیت
              می‌دهیم و تلاش می‌کنیم تا یک محیط کاری حمایتی و انگیزه‌بخش ایجاد
              کنیم. [اشاره به نقش‌های کلیدی در تیم و تخصص آن‌ها].
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
