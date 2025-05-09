import { useContext, createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("auth");
  const [user, setUser] = useState();

  const loginAuth = async (data) => {
    try {
      console.log("calling authentication api");
      const res = await axios.post("/api/auth/signin", {
        auth: data,
      });
      if (res.data.username !== undefined) {
        const loggedInUser = await getUser();
        if (loggedInUser !== undefined)
            return navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async () => {
    try {
      console.log("calling read cookie api")
      const res = await axios.get("/api/auth/me");
      if (res.data.username !== undefined) {
        setScreen(res.data.role);
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
      }
    } catch (e) {
      setScreen("auth");
      console.log(e);
    }
  };

  const logoutAuth = async () => {
    try {
      console.log("calling clear cookie api")
      await axios.post("/api/auth/signout");
      localStorage.removeItem('user');
      setScreen("auth");
      setUser(null);
      navigate("/login");
      return;
    } catch (e) {
      localStorage.removeItem('user');
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ screen, user, loginAuth, logoutAuth, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
export const useAuth = () => {
  return useContext(AuthContext);
};