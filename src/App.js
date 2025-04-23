import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
// import ManageSongs from "./pages/ManageSongs/ManageSongs";
import ManageUser from "./pages/ManageUsers/ManageUser";
import TableSongs from "./pages/ManageSongs/TableSongs";
import { auth } from "./firebase";
import { setCustomClaims } from "./services/authService";
import axios from "./utils/AxiosCustomize";
import { FaSpinner } from "react-icons/fa";
import { connectToNotificationHub } from "./services/notificationHub";

export default function App() {
  const [loading, setLoading] = useState(true);
  const { user, login, logout } = useAuth();

  const handleAuthStateChanged = async (user) => {
    // console.log("[Auth] User state changed:", user ? user.email : "null");
    // console.log("[Auth] User state changed:", user);
    if (user) {
      const providerId = user.providerData[0]?.providerId;
      // console.log("[Auth] Provider ID:", providerId);

      // Kiểm tra email đã xác minh hoặc đăng nhập qua Facebook
      if (user.emailVerified || providerId === "facebook.com") {
        try {
          // console.log("[Auth] User is verified or Facebook login");
          const tokenResult = await user.getIdTokenResult(true);

          // Gửi token đến server để thiết lập custom claims
          await setCustomClaims(tokenResult.token);

          // Chờ một chút trước khi làm mới token (tránh việc claims chưa cập nhật)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Force refresh token để nhận claims mới nhất
          const updatedTokenResult = await user.getIdTokenResult(true);

          // Xác định roles dựa trên claim 'roles'
          login(user, updatedTokenResult.claims.roles || []);
          // console.log("Login called with user:", user);

          // // Cập nhật header API
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${updatedTokenResult.token}`;
          if (user) {
            <Navigate to="/" replace />;
          }
          console.log("[Auth] User roles:", user.accessToken);
          // ✅ Gọi connectToNotificationHub sau khi đăng nhập thành công
          connectToNotificationHub((data) => {
            console.log("📢 Received notification:", data);
            // TODO: hiển thị toast / update UI tại đây
          }, user.accessToken);
        } catch (error) {
          console.error("Token refresh error:", error);
        }
      } else {
        console.log("[Auth] Email not verified and not Facebook login");
        logout();
      }
    } else {
      console.log("[Auth] User is null");
      logout();
    }
  };

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(async (user) => {
      await handleAuthStateChanged(user);
      setLoading(false);
    });
    return () => subscriber();
  }, []);

  if (loading)
    return (
      <div className="text-center py-8 w-full h-screen flex flex-col justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" />
        <p className="mt-2 text-gray-600">Loading ...</p>
      </div>
    );

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              {/* <Route path="/manage-song" element={<ManageSongs />} /> */}
              <Route path="/table-song" element={<TableSongs />} />
              <Route path="/manage-user" element={<ManageUser />} />
              {/* <Route path="/manage-user" element={<TableSongs />} /> */}
            </Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/signin" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
