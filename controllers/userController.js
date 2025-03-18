const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const axios = require("axios");

exports.loadUsers = async (req, res) => {
  try {
    // get data from JSON place holders
    const { data: users } = await axios.get("https://jsonplaceholder.typicode.com/users");
    const { data: posts } = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const { data: comments } = await axios.get("https://jsonplaceholder.typicode.com/comments");


    // itarating on every user
    for (let user of users) {
      const newUser = await User.create(user);

      const userPosts = posts.filter(post => post.userId === user.id);
      for (let post of userPosts) {
        const newPost = await Post.create({ ...post, userId: newUser._id });

        const postComments = comments.filter(comment => comment.postId === post.id);
        for (let comment of postComments) {
          const newComment = await Comment.create({ ...comment, postId: newPost._id });
          newPost.comments.push(newComment._id);
        }
        await newPost.save();
        newUser.posts.push(newPost._id);
      }
      await newUser.save();
    }

    res.status(200).json({ message: "Data loaded successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error loading data", error });
  }
};

// for delete  all users
exports.deleteAllUsers = async (req, res) => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  res.status(200).json({ message: "All users deleted" });
};

// delete a user by id
exports.deleteUserById = async (req, res) => {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId);
  await Post.deleteMany({ userId });
  res.status(200).json({ message: "User deleted" });
};

// get user details
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate({
    path: "posts",
    populate: { path: "comments" },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

// add a new user
exports.addUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
};
