import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBookById, updateBook } from "../../api/book.api";
import { fetchCategories } from "../../api/category.api";

const EditBook = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [categoriesRes, bookRes] = await Promise.all([
          fetchCategories(),
          fetchBookById(numericId),
        ]);
        console.log("Categories response:", categoriesRes);

        setCategories(categoriesRes.categories || []);
        setBook(bookRes.book || bookRes); // اگر ساختار متفاوت بود اینو تنظیم می‌کنیم
      } catch (err) {
        console.error("Error loading edit data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [numericId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // فقط فیلدهای واقعی جدول Book
      const payload = {
        title: book.title,
        author: book.author,
        translator: book.translator,
        publisher: book.publisher,
        description: book.description,
        ISBN: book.ISBN,
        price: book.price,
        coverImage: book.coverImage,
        categoryId: book.categoryId,
      };

      await updateBook(numericId, payload);

      alert("کتاب با موفقیت ویرایش شد!");
      navigate("/dashboard/admin/books");
    } catch (err) {
      console.error("Error updating book:", err);
      alert("خطا در ویرایش کتاب");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!book) return <div>کتاب پیدا نشد!</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">ویرایش کتاب</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          value={book.title || ""}
          onChange={handleChange}
          placeholder="عنوان کتاب"
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="author"
          value={book.author || ""}
          onChange={handleChange}
          placeholder="نویسنده"
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="translator"
          value={book.translator || ""}
          onChange={handleChange}
          placeholder="مترجم"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="publisher"
          value={book.publisher || ""}
          onChange={handleChange}
          placeholder="ناشر"
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          value={book.description || ""}
          onChange={handleChange}
          placeholder="توضیحات"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="ISBN"
          value={book.ISBN || ""}
          onChange={handleChange}
          placeholder="ISBN"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={book.price || 0}
          onChange={handleChange}
          placeholder="قیمت"
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="coverImage"
          value={book.coverImage || ""}
          onChange={handleChange}
          placeholder="آدرس تصویر جلد"
          className="border p-2 rounded"
        />

        <select
          name="categoryId"
          value={book.categoryId || ""}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">دسته‌بندی را انتخاب کنید</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
};

export default EditBook;
