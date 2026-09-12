import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../redux/userSlice";

function Home() {
  // ACCESS THE DATA
  const { userData } = useSelector((state) => state.user);
  console.log(userData);

  //   login data also set in userData
  const dispatch = useDispatch();

  // Send Firebase token to backend
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", {
        token,
      });

      console.log("Backend response:", data);

    //   set the login user data
      dispatch(setUserdata(data));
    } catch (error) {
      console.error(
        "Backend login error:",
        error.response?.data || error.message,
      );
    }
  };

  // Google Login
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);

      // Get Firebase ID token
      const token = await result.user.getIdToken();

      console.log("Firebase ID Token:", token);

      // Send token to backend
      await handleLogin(token);

      console.log("Google user:", result.user);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-900 flex justify-center items-center">
      {!userData && (
        <div className="bg-slate-800 p-10 rounded-lg shadow-2xl text-center">
          <h1 className="text-white text-2xl font-bold mb-2">
            Welcome to AlexAI
          </h1>
          <p className="text-gray-400 mb-8">Please login to using this app</p>

          <button
            onClick={googleLogin}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-white rounded-lg cursor-pointer font-medium hover:bg-gray-100 transition"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
