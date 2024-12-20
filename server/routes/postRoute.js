import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  getComments,
  getFollowers,
  getPopularContents,
  getPost,
  getPostContent,
  getPosts,
  stats,
  updatePost,
} from "../controllers/postController.js";

const router = express.Router();

// ADMIN ROUTES
router.get("/admin-analytics", userAuth, stats);
router.get("/admin-followers", userAuth, getFollowers);
router.get("/admin-content", userAuth, getPostContent);
router.post("/create-post", userAuth, createPost);

// LIKE & COMMENT ON POST
router.post("/comment/:id", userAuth, commentPost);

// UPDATE POST
router.put("/update/:id", userAuth, updatePost);

// GET POSTS ROUTES
router.get("/", getPosts);
router.get("/popular", getPopularContents);
router.get("/:postId", getPost);
router.get("/comments/:postId", getComments);

// DELETE POSTS ROUTES
router.delete("/:id", userAuth, deletePost);
router.delete("/comment/:id/:postId", userAuth, deleteComment);

export default router;
