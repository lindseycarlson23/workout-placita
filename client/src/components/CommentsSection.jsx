import Comment from "./Comment";

function CommentsSection({ comments, onCreateComment, workoutId }) {
  if(!comments || !comments.length) {
    return (
      <>
        <h4>No comments yet</h4>
        {/* This comment is the comment form */}
        <Comment onCreateComment={onCreateComment} workoutId={workoutId} />
      </>
    )
  }

  return (
    <>
      <h4>Comments</h4>

      <div className="d-flex flex-column gap-3">
        <Comment onCreateComment={onCreateComment} workoutId={workoutId} />
        {comments.map((comment, index) => {
          return <Comment key={index} comment={comment} onCreateComment={onCreateComment} workoutId={workoutId}/>
        })}
      </div>
    </>
  );
}

export default CommentsSection;