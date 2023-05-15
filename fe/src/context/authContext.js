import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );



  const login = async (input) => {
    //TO DO
    const res = await axios.post("http://localhost:2000/auth/login", input, {
      withCredentials: true
    })
    console.log(res);
    setCurrentUser(res.data.others)
    localStorage.setItem("logoutToken", res.data.token)
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
