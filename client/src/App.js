import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  Home,
  CategoriesPage,
  BlogDetails,
  LoginPage,
  WriterPage,
  SignUpPage,
  ProfilePage,
} from "./pages";
import { Footer, Loading, Navbar } from "./components";
import useStore from "./store";

function Layout() {
  const { user } = useStore();
  const location = useLocation();

  return (
    <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const { theme, isLoading } = useStore();

  return (
    <main className={theme}>
      <div className="w-full min-h-screen relative bg-white dark:bg-[#020b19] transition-all duration-500">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<CategoriesPage />} />
            <Route path="/:slug/:id" element={<BlogDetails />} />
            <Route path="/writer/:id" element={<WriterPage />} />
            <Route path="/user/:id" element={<ProfilePage />} />
          </Route>
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>

        {isLoading && <Loading />}
      </div>
    </main>
  );
}

export default App;
