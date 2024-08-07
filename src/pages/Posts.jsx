import { useState, useEffect, useContext } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";
import Swal from "sweetalert2";
import EditBlog from "../components/EditBlog";
import DeleteBlog from "../components/DeleteBlog";
import BlogModal from '../components/BlogModal'; 



export default function Posts() {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	
	const [posts, setPosts] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); 
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // console.log("API Response:", data);
  
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Unexpected data format:", data);
        }
        } catch (error) {
          console.error("Fetch error:", error);
        }
    };

    fetchPosts();
  }, []);


	function addPost(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/blogs/createBlog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        content: content
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "A blog post with this title already exists") {
          Swal.fire({
            title: "Error on Creating Blog",
            icon: "error",
            text: `Blog ${title} is already an existing blog`,
          });
        } else if (data) {
        	console.log(data)
          setTitle("");
          setContent("");
          setPosts((prevPosts) => [...prevPosts, data]);

          Swal.fire({
            title: "Success on creating a Blog",
            icon: "success",
            text: "Blog Added Successfully.",
          });

        } else {
          Swal.fire({
            title: "Error on creating Blog",
            icon: "error",
            text: "Unsuccessful Blog Creation",
          });
        }
      });
  }

  console.log(posts);

  const handleShowPostModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleHidePostModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  // const handleUpdatePost = (updatedPost) => {
  //   setPosts((prevPosts) =>
  //     prevPosts.map((post) =>
  //       post.id === updatedPost.id ? updatedPost : post
  //     )
  //   );
  // };


  return (
    <>
      	<h1 className="text-center mt-5">Create a Blog</h1>
        <Form onSubmit={(e) => addPost(e)}>
          <Form.Group>
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Blog's title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Content:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Write your content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          
          <Button variant="primary" type="submit" className="my-3">
            Submit
          </Button>
        </Form>

        <h1 className="text-center my-4"> Blog Posts</h1>
                     
              <Table striped bordered hover responsive>
                  <thead>
                      <tr className="text-center">
                          <th>Title</th>
                          <th>Content</th>
                          <th>Author</th>
                          <th>Created On</th>
                          <th colSpan="2">Comments</th>
                          <th colSpan="2">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                          <td className="text-center">
                            <Button variant="link" onClick={() => handleShowPostModal(post)}>
                              {post.title}
                            </Button>
                          </td>
                          <td>{post.content}</td>
                          <td className="text-center">{post.author}</td>
                          <td className="text-center">{new Date(post.createdOn).toLocaleDateString()}</td>
                          <td colSpan="2">
                            {post.comments.map((comment) => comment.comment).join(', ')}
                          </td>
                          <td colSpan="2" className="text-center">
                            <Button className="my-2 me-2"
                              variant="warning"
                              onClick={() => setEditingBlog(post)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => setDeletingBlog(post)}
                            >
                              Delete
                            </Button>
                          </td>
                      </tr>
                    ))}
                  </tbody>
              </Table>  

              {editingBlog && (
                <EditBlog
                  blogPost={editingBlog}
                  onClose={() => setEditingBlog(null)}
                  onUpdate={(updatedPost) => {
                    setPosts((prevPosts) =>
                      prevPosts.map((post) =>
                        post.id === updatedPost.id ? updatedPost : post
                      )
                    );
                    setEditingBlog(null);
                  }}
                />
              )}

              {deletingBlog && (
                <DeleteBlog
                  blogPost={deletingBlog}
                  onClose={() => setDeletingBlog(null)}
                  onDelete={(deletedBlogId) => {
                    setPosts((prevPosts) =>
                      prevPosts.filter((w) => w.id !== deletedBlogId)
                    );
                    setDeletingBlog(null);
                  }}
                />
              )}

              <BlogModal
                post={selectedPost}
                show={showModal}
                onHide={handleHidePostModal}
                onUpdate={(updatedPost) => {
                    setPosts((prevPosts) =>
                      prevPosts.map((post) =>
                        post.id === updatedPost.id ? updatedPost : post
                      )
                    );
                  }}
                />
              
    </>
  );
}
