import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const BlogModal = ({ post, show, onHide, onUpdate }) => {
  const [comment, setComment] = useState('');

  if (!post) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/addComment/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.message === "Comment added successfully") {
        // Show success alert
        Swal.fire({
          title: 'Comment Added',
          icon: 'success',
          text: 'Your comment was added successfully.',
        });

        setComment('');

        // onUpdate(data.updatedPost);
        onUpdate({ ...post, comment });

      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'There was an error adding your comment.',
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'An error occurred while adding your comment.',
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>{post.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Content:</h5>
        <p>{post.content}</p>
        <h5>Author:</h5>
        <p>{post.author}</p>
        <h5>Created On:</h5>
        <p>{new Date(post.createdOn).toLocaleDateString()}</p>
        <h5>Comments:</h5>
        <ul>
          {post.comments.map((comment) => (
            <li key={comment._id}>{comment.comment}</li>
          ))}
        </ul>
        <Form onSubmit={handleAddComment}>
          <Form.Group controlId="formComment">
            <Form.Label>Add a Comment:</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlogModal;