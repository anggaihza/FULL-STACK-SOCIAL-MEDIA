import "./profile.scss";

import Posts from "../../components/posts/Posts";
import {makeRequest} from "../../axios";
import {useMutation, useQuery} from "@tanstack/react-query";
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

  const resendEmailMutation = useMutation(
    (verify) => {
      return makeRequest.get(`/auth/verify-email/${data.verification_token}`);
    },
    {
      onSuccess: () => {
        alert("Verification email success");
      },
    }
  );

  const handleEmail = () => {
    resendEmailMutation.mutate();
  };

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
            <div className="center">
              <span>{data?.fullname}</span>
              <p>Email: {data?.email}</p>
              <p className="bio">Bio: {data?.bio}</p>
            </div>
            <div className="right">
              <div>
                {data?.status === "verified" ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <>
                    <button onClick={() => setOpenUpdate(true)}>update</button>
                    <button onClick={handleEmail}>Verification</button>
                  </>
                )}
              </div>
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
