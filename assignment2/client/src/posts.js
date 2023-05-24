import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, TextField } from '@mui/material';

const SocialMediaApp = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [picture, setPicture] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4002/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('picture', picture);

    try {
      await axios.post('http://localhost:4002/posts', formData);
      fetchPosts();
      setTitle('');
      setContent('');
      setPicture(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const addComment = async (postId, commentBody) => {
    try {
      await axios.post(`http://localhost:4002/posts/${postId}/comments`, {
        body: commentBody,
        user: postId, // Replace with the actual user name or user ID
      });

      fetchPosts();
      setCommentInputs((prevState) => ({ ...prevState, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.post(`http://localhost:4002/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prevState) => ({ ...prevState, [postId]: value }));
  };

  return (
    <Container>
      <h1>Social Media App</h1>
      <div>
        <h2>Create a new post:</h2>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="file" onChange={(e) => setPicture(e.target.files[0])} />
        <Button variant="contained" color="primary" onClick={createPost}>
          Create Post
        </Button>
      </div>
      <div>
        <h2>Posts:</h2>
        {posts.map((post) => (
          <div key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.picture && <img src={`http://localhost:4002/uploads/${post.picture}`} alt="Post" />}
            <Button variant="contained" color="primary" onClick={() => likePost(post._id)}>
              Like ({post.likes})
            </Button>
            <TextField
              label="Add a comment"
              value={commentInputs[post._id] || ''}
              onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={() => addComment(post._id, commentInputs[post._id])}>
              Add Comment
            </Button>
            <ul>
              {post.comments.map((comment, index) => (
                <li key={index}>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default SocialMediaApp;
