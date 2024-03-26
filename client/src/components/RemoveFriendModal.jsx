import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { REMOVE_FRIEND } from '../utils/mutations';

const RemoveFriendModal = ({ show, onHide, friend, onRemoveFriend }) => {
  const [removeFriend] = useMutation(REMOVE_FRIEND);

  const handleRemoveFriend = async () => {
    try {
      await removeFriend({
        variables: { friendId: friend._id },
      });

      onRemoveFriend(friend._id);

      onHide();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Remove {friend.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to remove {friend.name} as a friend?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Close
        </Button>
        <Button variant='danger' onClick={handleRemoveFriend}>
          Remove Friend
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RemoveFriendModal;