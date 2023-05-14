import "./editPost.scss";
import {useState} from "react";
import {makeRequest} from "../../axios";
import {useMutation, QueryClient, useQueryClient} from "@tanstack/react-query";

const EditPost = ({postId}) => {
  const [caption, setCaption] = useState("");

  const [openUpdate, setOpenUpdate] = useState(false);

  const queryClient = useQueryClient();

  console.log(caption);

  const mutation = useMutation(
    (updatedPost) => makeRequest.patch(`/posts/${postId}`, {caption}),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        setOpenUpdate(false);
      },
    }
  );

  const handleUpdate = () => {
    mutation.mutate({caption});
  };

  return (
    <div className="editPost">
      <div onClick={() => setOpenUpdate(true)} className="editBtn">
        Edit
      </div>

      {openUpdate && (
        <div className="modal">
          <div className="modal-content">
            <div className="close" onClick={() => setOpenUpdate(false)}>
              &times;
            </div>
            <h3>Edit post</h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPost;
