import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toPersianNumber } from "../../utils/toPersianNumbers";

import {
  fetchBooks,
  softDeleteBook,
  restoreBook,
  toggleBookAvailability,
  updateBookStock,
} from "../../api/book.api";

const AdminBooks = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search,
        author,
        categoryId,
        page,
        limit,
        includeDeleted,
        sortBy,
        order,
      };
      const data = await fetchBooks(params);
      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  }, [search, author, categoryId, page, limit, includeDeleted, sortBy, order]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleSearchApply = () => {
    setPage(1);
    loadBooks();
  };

  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این کتاب مطمئن هستید؟")) {
      await softDeleteBook(id);
      loadBooks();
    }
  };

  const handleRestore = async (id) => {
    await restoreBook(id);
    loadBooks();
  };

  const handleToggleAvailability = async (id) => {
    await toggleBookAvailability(id);
    loadBooks();
  };

  const handleStockUpdate = async (id) => {
    const amount = parseInt(prompt("تعداد اضافه/کاهش موجودی:"));
    if (!isNaN(amount)) {
      const note = prompt("توضیح (اختیاری):") || "";
      await updateBookStock(id, amount, note);
      loadBooks();
    }
  };

  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">مدیریت کتاب‌ها</h2>

        <Link
          to="/dashboard/admin/books/add"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          افزودن کتاب
        </Link>
      </div>

      {/* فیلتر و جستجو */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="جستجو بر اساس عنوان"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="جستجو بر اساس نویسنده"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="ID دسته‌بندی"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <button
          onClick={handleSearchApply}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          اعمال فیلتر
        </button>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={() => setIncludeDeleted((prev) => !prev)}
          />
          نمایش حذف شده‌ها
        </label>
      </div>

      {/* جدول کتاب‌ها */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th
              className="border p-2 cursor-pointer"
              onClick={() => {
                setSortBy("title");
                setOrder(order === "asc" ? "desc" : "asc");
              }}
            >
              عنوان
            </th>
            <th className="border p-2">نویسنده</th>
            <th className="border p-2">قیمت</th>
            <th className="border p-2">موجودی</th>
            <th className="border p-2">فعال</th>
            <th className="border p-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="p-4 text-center">
                در حال بارگذاری...
              </td>
            </tr>
          ) : books.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center">
                هیچ کتابی پیدا نشد
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id} className={book.isDeleted ? "bg-red-100" : ""}>
                <td className="border p-2">{book.title}</td>
                <td className="border p-2">{book.author}</td>
                <td className="border p-2">{toPersianNumber(book.price)}</td>
                <td className="border p-2">{toPersianNumber(book.stock)}</td>
                <td className="border p-2">{book.isAvailable ? "✔️" : "❌"}</td>
                <td className="border p-2 flex gap-1 flex-wrap">
                  {!book.isDeleted && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/admin/books/edit/${book.id}`)
                        }
                        className="bg-purple-500 text-white px-2 py-1 rounded"
                      >
                        ویرایش
                      </button>

                      <button
                        onClick={() => handleToggleAvailability(book.id)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded"
                      >
                        تغییر وضعیت
                      </button>
                      <button
                        onClick={() => handleStockUpdate(book.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        موجودی
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        حذف
                      </button>
                    </>
                  )}
                  {book.isDeleted && (
                    <button
                      onClick={() => handleRestore(book.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      بازیابی
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* صفحه‌بندی */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          قبلی
        </button>
        <span>
          صفحه {toPersianNumber(page)} از {toPersianNumber(totalPages)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default AdminBooks;
