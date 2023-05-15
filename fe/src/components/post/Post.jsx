import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import {Link} from "react-router-dom";
import Comments from "../comments/Comments";
import {useContext, useState} from "react";
import moment from "moment";

import {makeRequest} from "../../axios";
import {useQuery, useMutation, QueryClient} from "@tanstack/react-query";
import {AuthContext} from "../../context/authContext";
import EditPost from "../editPost/EditPost";

const Post = ({post}) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const {isLoading, error, data} = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  // console.log(data);

  const queryClient = new QueryClient();

  // Like & Delete like
  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", {postId: post.id});
    },
    {
      onSuccess: () => {
        // refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  // Delete post
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data?.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={"/upload/" + data?.profilePic}
              alt="www"
              className="profilePic"
            />
            <div className="details">
              <Link
                to={`/profile/${post?.userId}`}
                style={{textDecoration: "none", color: "inherit"}}>
                <span className="name">{post.username}</span>
              </Link>

              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.caption}</p>
          <img src={"./upload/" + post.image} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "Loading"
            ) : data?.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{color: "red"}}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comments
          </div>
          <div className="item">
            <Link to={`/post/${post.id}`}>Detail</Link>
          </div>
          <div className="item">
            <EditIcon />
            <div
              className="item"
              onClick={() => setCommentOpen(!editOpen)}></div>
            {currentUser && currentUser.id === post.userId && (
              <EditPost postId={post.id} />
            )}
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
