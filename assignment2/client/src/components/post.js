import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, TextField, Card, CardContent, CardActions, Typography } from '@mui/material';

const SocialMediaApp = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [picture, setPicture] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [updateContentInput, setUpdateContentInput] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://qwert-ujnp.onrender.com/posts');
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
      await axios.post('https://qwert-ujnp.onrender.com/posts', formData);
      fetchPosts();
      setTitle('');
      setContent('');
      setPicture(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const updatePostContent = async (postId, newContent) => {
    try {
      await axios.put(`https://qwert-ujnp.onrender.com/posts/${postId}`, { content: newContent });
      fetchPosts();
      setUpdateContentInput((prevState) => ({ ...prevState, [postId]: '' }));
    } catch (error) {
      console.error('Error updating post content:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`https://qwert-ujnp.onrender.com/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const addComment = async (postId, commentBody) => {
    try {
      await axios.post(`https://qwert-ujnp.onrender.com/posts/${postId}/comments`, {
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
      await axios.post(`https://qwert-ujnp.onrender.com/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prevState) => ({ ...prevState, [postId]: value }));
  };

  const handleUpdateContentInputChange = (postId, value) => {
    setUpdateContentInput((prevState) => ({ ...prevState, [postId]: value }));
  };

  return (
    <Container maxWidth="xl" >
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
          <Card key={post._id} style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.content}
              </Typography>
              {post.picture && <img src={`https://qwert-ujnp.onrender.com/uploads/${post.picture}`} alt="Post" style={{ width: '100%', marginTop: '10px' }} />}
            </CardContent>
            <CardActions>
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
              <TextField
                label="Update content"
                value={updateContentInput[post._id] || ''}
                onChange={(e) => handleUpdateContentInputChange(post._id, e.target.value)}
              />
              <Button variant="contained" color="secondary" onClick={() => updatePostContent(post._id, updateContentInput[post._id])}>
                Update Content
              </Button>
              <Button variant="contained" color="error" onClick={() => deletePost(post._id)}>
                Delete Post
              </Button>
            </CardActions>
            <ul>
              {post.comments.map((comment, index) => (
                <li key={index}>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default SocialMediaApp;
