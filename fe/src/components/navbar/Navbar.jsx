import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import {Link, useLocation, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../context/authContext";
import {makeRequest} from "../../axios";
import {QueryClient, useMutation, useQuery} from "@tanstack/react-query";

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate(); // Access the navigate function

  // Delete post
  const logoutMutation = useMutation(
    (logOut) => {
      return makeRequest.post("/auth/logout");
    },
    {
      onSuccess: () => {
        localStorage.removeItem("logoutToken");
        navigate("/login"); // Navigate to the login page
      },
    }
  );

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{textDecoration: "none"}}>
          <HomeOutlinedIcon />
        </Link>
      </div>
      <div className="right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <div className="user">
          <Link
            to={`/profile/${currentUser?.id}`}
            style={{textDecoration: "none", color: "inherit"}}>
            <span>{currentUser.username}</span>
            <img src={"/upload/" + currentUser.profilePic} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
