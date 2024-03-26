import { useRef, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT, REPLY_COMMENT, REMOVE_COMMENT, REMOVE_REPLY } from "../utils/mutations";

const profilePictureStyle = {
  height: "0.5in",
  borderRadius: "0.25in"
};

const replyProfilePictureStyle = {
  height: "0.3in",
  borderRadius: "0.15in"
};
function CommentSettings({ onRemove, onReply, onEdit, canRemove, canEdit, setReplying }) {
  return (
    <div className="dropdown">
      <button className="btn btn-link text-secondary" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => setReplying(false)}>
        <i className="fa fa-ellipsis-vertical"/>
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        { canRemove ? (
          <li>
            <button className="dropdown-item" onClick={onRemove}>Remove</button>
          </li>
        ) : null }
        { canEdit ? (
          <li>
            <button className="dropdown-item" onClick={onEdit}>Edit</button>
          </li>
        ) : null }
        <li>
          <button className="dropdown-item" onClick={onReply}>Reply</button>
        </li>
      </ul>
    </div>
  );
}

function Reply({ reply, onReply, setReplying, onCreateComment }) {

  const [removeReplyMutation] = useMutation(REMOVE_REPLY);

  function removeReply() {
    removeReplyMutation({
      variables: {
        replyId: reply._id
      }
    }).then(() => {
      onCreateComment();
    }).catch((error) => {
      console.error(error)
    });
  }

  return (
    <div className="d-flex gap-2">
      <img style={replyProfilePictureStyle} src="/default-pfp.jpg"></img>
      <div className="flex-grow-1">
        <div className="d-flex">
          <h6 className="mt-1">{ reply.name }</h6>
          <span className="flex-grow-1" />
          <CommentSettings canRemove={reply.canRemove} onRemove={removeReply} onReply={onReply} setReplying={setReplying} />
          <span className="px-3"></span>
        </div>
        <p className="mb-1">{ reply.replyBody }</p>
      </div>
    </div>
  );
}

function Comment({ comment, onCreateComment, workoutId }) {

  const textArea = useRef();
  const replyTextArea = useRef();
  const [preFill, setPreFill] = useState("");
  const [isReplying, setReplying] = useState(false);
  const [createCommentMutation] = useMutation(ADD_COMMENT);
  const [createReplyMutation] = useMutation(REPLY_COMMENT);
  const [removeCommentMutation] = useMutation(REMOVE_COMMENT);

  useEffect(() => {
    if(isReplying) {
      replyTextArea.current.focus();
      replyTextArea.current.value = preFill;
    }
  }, [isReplying]);

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

  function createReply(event) {
    event.preventDefault();
    createReplyMutation({
      variables: {
        commentId: comment._id,
        replyBody: replyTextArea.current.value
      }
    }).then(() => {
      replyTextArea.current.value = "";
      onCreateComment();
    }).catch((error) => {
      console.error(error)
    }).finally(() => {
      setReplying(false);
    });
  }

  function removeComment() {
    removeCommentMutation({
      variables: {
        commentId: comment._id,
        workoutId: workoutId
      }
    }).then(() => {
      onCreateComment();
    }).catch((error) => {
      console.error(error)
    });
  }

  return comment ? (
    <div className="d-flex gap-2">
      <img style={profilePictureStyle} src="/default-pfp.jpg"></img>
      <div className="flex-grow-1">
        <div className="d-flex">
          <h5>{ comment.name }</h5>
          <span className="flex-grow-1" />
          <CommentSettings canRemove={comment.canRemove} onRemove={removeComment} onReply={() => { setReplying(true); setPreFill(""); }} setReplying={setReplying} />
        </div>
        <p className="mb-1">{ comment.commentBody }</p>
        { isReplying ? (
          <form role="add-reply" className="d-flex gap-2 align-items-start mb-2" onSubmit={createReply}>
            <textarea ref={replyTextArea} className="form-control" type="text" placeholder="Reply"></textarea>
            <button className="btn btn-primary">
              <i className="fa fa-paper-plane"></i>
            </button>
          </form>
        ) : (
          <button className="btn btn-sm btn-secondary-outline p-0 mt-1 mb-3" onClick={() => { setReplying(true); setPreFill(""); }}>Add Reply</button>
        )}
        <div className="d-flex flex-column gap-2">
          { comment.replies.map((reply, index) => {
            return <Reply key={index} reply={reply} onReply={() => { setReplying(true); setPreFill("@" + reply.name + " ") }} setReplying={setReplying} onCreateComment={onCreateComment} />
          })}
        </div>
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