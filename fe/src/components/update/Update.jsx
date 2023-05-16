import React, {useState} from "react";
import "./update.scss";
import {makeRequest} from "../../axios";
import {QueryClient, useMutation} from "@tanstack/react-query";

const Update = ({setOpenUpdate, user}) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    username: user.username,
    fullname: user.fullname,
    bio: user.bio,
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  console.log(user);

  const handleChange = (e) => {
    setTexts((prev) => ({...prev, [e.target.name]: [e.target.value]}));
  };

  const queryClient = new QueryClient();

  // Mutations
  const mutation = useMutation(
    (newPost) => {
      return makeRequest.put("/users", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    try {
      coverUrl = cover ? await upload(cover) : user.coverPic;
      profileUrl = cover ? await upload(profile) : user.profilePic;

      const updatedUser = {
        ...texts,
        coverPic: coverUrl,
        profilePic: profileUrl,
      };
      await mutation.mutateAsync(updatedUser);

      setOpenUpdate(false);
    } catch (error) {
      console.log(error);
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        alert("An error occurred while updating the user.");
      }
    }
  };

  return (
    <div className="update">
      <div className="wrapper">
        <form action="">
          <input
            type="file"
            placeholder="Cover"
            onChange={(e) => setCover(e.target.files[0])}
          />
          <input
            type="file"
            placeholder="Profile"
            onChange={(e) => setProfile(e.target.files[0])}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            type="text"
            name="fullname"
            placeholder="Fullname"
            onChange={handleChange}
          />
          <input
            type="text"
            name="bio"
            placeholder="bio"
            onChange={handleChange}
          />
          <button onClick={handleClick}>update</button>
        </form>
        <button onClick={() => setOpenUpdate(false)}>Close</button>
      </div>
    </div>
  );
};

export default Update;
