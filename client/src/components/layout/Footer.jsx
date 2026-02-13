const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          {/* ستون اول: کتاب‌ها */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">کتاب‌ها</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  پرفروش‌ترین‌ها
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  جدیدترین کتاب‌ها
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  محبوب‌ترین‌ها
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  تخفیف‌دار
                </a>
              </li>
            </ul>
          </div>

          {/* ستون دوم: صفحات سایت */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">درباره سایت</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  تماس با ما
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  سوالات متداول
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  قوانین و مقررات
                </a>
              </li>
            </ul>
          </div>

          {/* ستون سوم: لینک‌های خارجی */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">لینک‌های مفید</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.iranketab.ir"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  ایران کتاب
                </a>
              </li>
              <li>
                <a
                  href="https://www.ketabrah.ir"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  کتابراه
                </a>
              </li>
              <li>
                <a
                  href="https://www.fidibo.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  فیدیبو
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} کلیه حقوق محفوظ است — طراحی و توسعه توسط{" "}
          <span className="text-white">Mehrdad Khorasani</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
