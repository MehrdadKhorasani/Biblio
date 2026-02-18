import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "../../api/book.api";
import { fetchCategories } from "../../api/category.api";

const AddBook = () => {
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    translator: "",
    publisher: "",
    description: "",
    ISBN: "",
    price: 0,
    stock: "",
    coverImage: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

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
      await createBook(book);
      alert("کتاب با موفقیت اضافه شد!");
      navigate("/dashboard/admin/books");
    } catch (err) {
      console.error("Error creating book:", err);
      alert("خطا در افزودن کتاب");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => navigate("/dashboard/admin/books")}
        >
          ← بازگشت به لیست کتاب‌ها
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">افزودن کتاب جدید</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="عنوان کتاب"
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="author"
          value={book.author}
          onChange={handleChange}
          placeholder="نویسنده"
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="translator"
          value={book.translator}
          onChange={handleChange}
          placeholder="مترجم"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="publisher"
          value={book.publisher}
          onChange={handleChange}
          placeholder="ناشر"
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          value={book.description}
          onChange={handleChange}
          placeholder="توضیحات"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="ISBN"
          value={book.ISBN}
          onChange={handleChange}
          placeholder="ISBN"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={book.price}
          onChange={handleChange}
          placeholder="قیمت"
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          name="stock"
          value={book.stock}
          onChange={handleChange}
          placeholder="موجودی"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="coverImage"
          value={book.coverImage}
          onChange={handleChange}
          placeholder="آدرس تصویر جلد"
          className="border p-2 rounded"
        />

        <select
          name="categoryId"
          value={book.categoryId}
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
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          {saving ? "در حال ذخیره..." : "افزودن کتاب"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
