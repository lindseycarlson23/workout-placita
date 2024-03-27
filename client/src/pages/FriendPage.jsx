import { useParams } from "react-router-dom";
import WorkoutList from "../components/WorkoutList";
import Card from "react-bootstrap/Card";


export default function UserPage() {
  const userId = useParams().id;

  return (
    
    <>
      <div className="d-flex gap-2 p-2 align-items-start flex-wrap md-flex-direction-column">
        <WorkoutList userId={userId}/>
      </div>
    </>
  );
}