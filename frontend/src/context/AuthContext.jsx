import { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const signin = async (data) => {
    try {
      const res = await axios.post("/signin", data);
      setUser(res.data);
      setIsAuth(true);
      setIsAdmin(res.data.role === "admin");
      setIsOwner(res.data.role === "owner");
      return res.data;
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const signup = async (data) => {
    try {
      const res = await axios.post("/signup", data);
      setMessage(res.data.message);
    } catch (error) {
      setErrors([error.response?.data?.message || "Failed to register user"]);
    }
  };

  const signout = async () => {
    await axios.post("/signout");
    setUser(null);
    setIsAuth(false);
    setIsAdmin(false);
    setIsOwner(false);
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post("/forgot-password", { email });
      setMessage(res.data.message);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await axios.post(`/reset-password/${token}`, { newPassword });
      setMessage(res.data.message);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.put("/profile", data);
      setUser(res.data.user);
      setMessage(res.data.message);
    } catch (error) {
      setErrors([error.response?.data?.message || "Failed to update profile"]);
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await axios.delete("/profile");
      setUser(null);
      setIsAuth(false);
      setIsAdmin(false);
      setIsOwner(false);
      setMessage(res.data.message || "Account deleted successfully");
    } catch (error) {
      setErrors([error.response?.data?.message || "Failed to delete account"]);
    }
  };

  const verifyEmail = async (token) => {
    try {
      const res = await axios.get(`/verify/${token}`);
      setMessage(res.data.message);
    } catch (error) {
      setErrors([error.response?.data?.error || "Failed to verify email"]);
    }
  };

  const leaveCompany = async () => {
    try {
      const res = await axios.put("/leave-company");
      setUser((prev) => ({ ...prev, company_id: null }));
      setMessage(res.data.message);
    } catch (error) {
      setErrors([error.response?.data?.message || "Failed to leave company"]);
    }
  };

  const getMyCompany = async (companyId) => {
    try {
      const res = await axios.get(`/companies/${companyId}`);
      return res.data;
    } catch (error) {
      setErrors(["Failed to load company data"]);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.put("/change-password", {
        oldPassword,
        newPassword,
      });
      setMessage(res.data.message);
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to change password",
      ]);
    }
  };

  const clockIn = async () => {
    try {
      const res = await axios.post("/clock-in");
      setMessage("Clock-in registered successfully.");
      return res.data;
    } catch (error) {
      setErrors([error.response?.data?.message || "Failed to clock in."]);
    }
  };

  const clockOut = async () => {
    try {
      const res = await axios.post("/clock-out");
      setMessage("Clock-out registered successfully.");
      return res.data;
    } catch (error) {
      setErrors([error.response?.data?.message || "Failed to clock out."]);
    }
  };

  const getTodayEntry = async () => {
    try {
      const res = await axios.get("/clock-today");
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to get today's entry.",
      ]);
    }
  };

  const getMonthlyEntries = async (month, year) => {
    try {
      const res = await axios.get(`/clock-history?month=${month}&year=${year}`);
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to get monthly history.",
      ]);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("/profile")
      .then((res) => {
        setUser(res.data);
        setIsAuth(true);
        setIsAdmin(res.data.role === "admin");
        setIsOwner(res.data.role === "owner");
      })
      .catch(() => {
        setUser(null);
        setIsAuth(false);
        setIsAdmin(false);
        setIsOwner(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const clean = setTimeout(() => {
      setErrors(null);
    }, 5000);
    return () => clearTimeout(clean);
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isAdmin,
        isOwner,
        errors,
        message,
        loading,
        signup,
        signin,
        signout,
        updateProfile,
        forgotPassword,
        resetPassword,
        verifyEmail,
        leaveCompany,
        getMyCompany,
        changePassword,
        clockIn,
        clockOut,
        getTodayEntry,
        getMonthlyEntries,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
