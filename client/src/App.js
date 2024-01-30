import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import {
  Home,
  CategoriesPage,
  BlogDetails,
  LoginPage,
  WriterPage,
  SignUpPage,
  ProfilePage,
  WritePost,
} from "./pages";
import { Footer, Loading, Navbar } from "./components";
import useStore from "./store";

function Layout() {
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

function Secure() {
  const { user } = useStore();
  const location = useLocation();

  return user?.token ? (
    <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
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
          </Route>

          <Route element={<Secure />}>
            <Route path="/user/:id" element={<ProfilePage />} />
            <Route path="/write" element={<WritePost />} />
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
