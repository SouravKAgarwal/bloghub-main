import { Navigate, Outlet, useLocation, Routes, Route } from "react-router-dom";
import { NavBar, SideBar } from "./components";
import {
  Analytics,
  Content,
  Dashboard,
  Followers,
  OTPVerification,
  StartPage,
  WritePost,
} from "./pages";
import useStore from "./store";

function Layout() {
  const { user } = useStore();

  const location = useLocation();

  return user?.token ? (
    <div className="w-full h-screen">
      <NavBar />
      <div className="w-full h-full flex border-t pt-16">
        <div className="hidden lg:flex">
          <SideBar />
        </div>
        <div className="w-full flex-1 px-8 py-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useStore();

  return (
    <main className={theme}>
      <div className="w-full min-h-screen relative dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-[#302943] dark:via-slate-900 dark:to-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff] via-blue-50 to-white dark:text-white transition-all duration-500">
        <Routes>
          <Route element={<Layout />}>
            <Route index path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/followers" element={<Followers />} />
            <Route path="/contents" element={<Content />} />
            <Route path="/write/:postId?" element={<WritePost />} />
          </Route>
          <Route path="/auth" element={<StartPage />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
