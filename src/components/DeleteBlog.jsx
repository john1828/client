import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function DeleteBlog({ blogPost, onClose, onDelete }) {
  function handleDelete() {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/blogs/deleteBlog/${blogPost.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);

        if (data.message === "Only the author and admin are authorized to delete a blog") {
          Swal.fire({
            title: "Error on Deleting Blog",
            icon: "error",
            text: "Only Admin and Author can delete Blog",
          });
        } else if (data.message === 'Blog deleted successfully') {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Blog deleted successfully.',
          }).then(() => {
            onDelete(blogPost.id);
            onClose(); 
          });
        } else {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Failed to delete blog.',
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting Blog:', error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'An error occurred while deleting the blog.',
        });
      });
  }

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this blog?</p>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  );
}