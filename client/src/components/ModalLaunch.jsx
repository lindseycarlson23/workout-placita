import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import WorkoutLogFormModal from './WorkoutLogFormModal'; // Adjust the import path

const ModalLaunch = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  // conditional that looks for a workout id
  // pass id in through props
  // if there is an id, then show the edit modal
  // if not, show the log modal

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Log New Workout
      </Button>

      <WorkoutLogFormModal show={showModal} onHide={handleHideModal} />
    </>
  );
};

export default ModalLaunch;
