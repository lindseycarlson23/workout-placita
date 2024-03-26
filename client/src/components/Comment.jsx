import { useRef } from "react";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT } from "../utils/mutations";

const profilePictureStyle = {
  height: "0.5in",
  borderRadius: "0.25in"
};

function Comment({ comment, onCreateComment, workoutId, canRemove, canEdit }) {

  const textArea = useRef();
  const [createCommentMutation, { error }] = useMutation(ADD_COMMENT);

  function createComment(event) {
    event.preventDefault();

    createCommentMutation({
      variables: {
        workoutId: workoutId,
        commentBody: textArea.current.value
      }
    }).then(() => {
      textArea.current.value = "";
      onCreateComment();
    }).catch((error) => { console.error(error)});
  }

  return comment ? (
    <div className="d-flex gap-2">
      <img style={profilePictureStyle} src="/default-pfp.jpg"></img>
      <div className="flex-grow-1">
        <div className="d-flex">
          <h5>{ comment.name }</h5>
          <span className="flex-grow-1" />
          { canRemove || canEdit ? (
            <button className="btn btn-link text-secondary"><i className="fa fa-ellipsis-vertical"/></button>
          ) : null
          }
        </div>
        <p>{ comment.commentBody }</p>
        <button className="btn btn-secondary-outline btn-sm p-0">Add Reply</button>
      </div>
    </div>
  ) : (
    <div className="d-flex gap-2">
      <img style={profilePictureStyle} src="/default-pfp.jpg"></img>
      <form className="d-flex flex-grow-1 align-items-start gap-2" role="add-comment" onSubmit={createComment}>
        <textarea ref={textArea} className="form-control" type="text" placeholder="Add comment"></textarea>
        <button className="btn btn-primary">
          <i className="fa fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default Comment;