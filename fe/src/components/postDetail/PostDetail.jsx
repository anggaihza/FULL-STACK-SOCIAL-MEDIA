import "./postDetail.scss";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Link, useParams} from "react-router-dom";
import moment from "moment";
import {useState} from "react";
import {makeRequest} from "../../axios";
import {useQuery} from "@tanstack/react-query";

const PostDetail = () => {
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);

  const {postId} = useParams();
  console.log(post);

  const {isLoading, error, data} = useQuery(["postDetail", post.id], () =>
    makeRequest.get("/posts/" + postId).then((res) => {
      setPost(res.data.post[0]); // update the post state with the fetched post data
      console.log(res.data);
      setComments(res.data.comments); // update the comments state with the fetched post comments
      return res.data;
    })
  );

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{textDecoration: "none", color: "inherit"}}>
                <span className="name">{post.username}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.caption}</p>
          <img src={"/upload/" + post.image} alt="" />
        </div>
        <div className="info">
          <div className="item">
            <FavoriteOutlinedIcon
              style={{color: post.isLiked ? "red" : "inherit"}}
            />
            {post.numLikes} Likes
          </div>
          <div className="item">
            <TextsmsOutlinedIcon />
            Comments
          </div>
        </div>
        <div className="comments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <Link
                to={`/profile/${comment.userId}`}
                style={{textDecoration: "none", color: "inherit"}}>
                <span className="name">{comment.username}</span>
              </Link>
              <span className="text">{comment.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
