import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import RemoveFriendModal from './RemoveFriendModal'; // Adjust the import path

const RemoveFriendModalLaunch = ({friend, onRemoveFriend}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  return (
    <>
      <Button variant='link' size='sm' onClick={handleShowModal} className='text-danger'>
        <i className='fa fa-user-times ms-2' />
      </Button>

      <RemoveFriendModal friend={friend} show={showModal} onHide={handleHideModal} onRemoveFriend={onRemoveFriend} />
    </>
  );
};

export default RemoveFriendModalLaunch;