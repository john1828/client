import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";


export default function EditBlog({ blogPost, onClose, onUpdate }) {

  const [title, setTitle] = useState(blogPost.title);
  const [content, setContent] = useState(blogPost.content);


  	function handleSubmit(e) {
  	  e.preventDefault();
  	  const token = localStorage.getItem("token");
	
  	    fetch(`${import.meta.env.VITE_API_URL}/blogs/editBlog/${blogPost.id}`, {
  	      method: "PATCH",
  	      headers: {
  	        "Content-Type": "application/json",
  	        Authorization: `Bearer ${token}`,
  	      },
  	      body: JSON.stringify({ title, content }),
  	    })
  	    	.then((res) => res.json())
  	    	.then((data) => {
  	    	  	console.log("Backend response:", data);
		
  	  		    if (data.message === "Only the author is authorized to edit their blog post.") {
  	  		      Swal.fire({
  	  		        title: "Error on Editing Blog",
  	  		        icon: "error",
  	  		        text: "Only Author can edit their blogs",
  	  		      });
  	  		    } else if (data.message === "Blog post updated successfully") {
  	  		      Swal.fire({
  	  		        title: "Success",
  	  		        icon: "success",
  	  		        text: "Blog updated successfully.",
  	  		      });
  	  		      onUpdate({ ...blogPost, title, content });
  	  		      onClose();
  	  		      console.log(data);
  	  		    } else {
  	  		      Swal.fire({
  	  		        title: "Error",
  	  		        icon: "error",
  	  		        text: "Failed to update blog.",
  	  		      });
  	    		}
    		})
      		.catch((error) => {
        	console.error("Error updating blog:", error);
       			Swal.fire({
          			title: "Error",
          			icon: "error",
          			text: "An error occurred while updating the blog.",
        		});
      		});
  	};

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Blog Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>
          <Button className="mt-3" variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}