import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "../utils/AxiosCustomize";
import { auth } from "../firebase";

// Hàm đăng ký
export const registerWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Đăng ký thất bại:", error.message);
    throw error;
  }
};

// Hàm đăng nhập
export const loginWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Đăng nhập thất bại:", error.message);
    throw error;
  }
};

export const setCustomClaims = async (token) => {
  return await axios.post("/api/auth/setCustomClaims", {
    IdToken: token,
  });
};
