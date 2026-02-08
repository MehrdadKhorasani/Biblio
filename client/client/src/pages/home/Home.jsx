import Header from "../../components/layout/Header";
import Hero from "../../components/home/Hero";
import CategorySection from "../../components/categories/CategorySection";
import BookList from "../../components/books/BookList";
import Footer from "../../components/layout/Footer";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <CategorySection />
      <BookList />
      <Footer />
    </div>
  );
};

export default Home;
