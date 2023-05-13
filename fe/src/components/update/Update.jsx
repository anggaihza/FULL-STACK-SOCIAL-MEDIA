import React, {useState} from "react";
import "./update.scss";
import {makeRequest} from "../../axios";
import {QueryClient, useMutation} from "@tanstack/react-query";

const Update = ({setOpenUpdate, user}) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    username: user.username,
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
      console.log(res);
    } catch (error) {
      console.log(error);
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

    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = cover ? await upload(profile) : user.profilePic;

    mutation.mutate({...texts, coverPic: coverUrl, profilePic: profileUrl});
    setOpenUpdate(false);
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
          <button onClick={handleClick}>update</button>
        </form>
        <button onClick={() => setOpenUpdate(false)}>Close</button>
      </div>
    </div>
  );
};

export default Update;
