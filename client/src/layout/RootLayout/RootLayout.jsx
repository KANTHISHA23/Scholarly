import ScrollToTop from "../../components/ScrollToUp/ScrollToUp";
import Footer from "../../pages/shared/Footer/Footer";
import Navbar from "../../pages/shared/Navbar/Navbar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="bg-base-200">
      <Navbar />
      <main className="min-h-[calc(100vh-80px)]">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
