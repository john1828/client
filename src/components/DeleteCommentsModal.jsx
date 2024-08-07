import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const DeleteCommentsModal = ({ postId, show, onHide, onDelete }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/deleteBlogComments/${postId.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.message === "Comments deleted successfully") {
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'Comments have been deleted.',
        });
        onDelete();
        onHide();
      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Failed to delete comments.',
        });
      }
    } catch (error) {
      console.error('Error deleting comments:', error);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'An error occurred while deleting comments.',
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete comments for this blog post?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete Comments
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCommentsModal;