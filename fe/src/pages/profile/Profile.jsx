import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import {makeRequest} from "../../axios";
import {useQuery} from "@tanstack/react-query";
import {useLocation} from "react-router-dom";
import Update from "../../components/update/Update";
import {useState} from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const {isLoading, error, data} = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  console.log(data);
  return (
    <>
      <div className="profile">
        <div className="images">
          <img
            src={"/upload/" + data?.coverPic}
            alt="profile"
            className="cover"
          />
          <img
            src={"/upload/" + data?.profilePic}
            alt=""
            className="profilePic"
          />
        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" />
              </a>
            </div>
            <div className="center">
              <span>{data?.username}</span>
              <button onClick={() => setOpenUpdate(true)}>update</button>
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts />
        </div>
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </>
  );
};

export default Profile;
