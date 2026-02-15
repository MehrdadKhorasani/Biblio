import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/me");
        setFormData(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch("/users/me", formData);
      setMessage("اطلاعات با موفقیت بروزرسانی شد");
    } catch (err) {
      console.error(err);
      setMessage("خطا در بروزرسانی");
    }
  };

  if (loading) return <p>در حال دریافت اطلاعات...</p>;

  return (
    <div dir="rtl">
      <h2 className="text-2xl font-bold mb-6">پروفایل من</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">نام</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">نام خانوادگی</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">ایمیل</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
};

export default Profile;
