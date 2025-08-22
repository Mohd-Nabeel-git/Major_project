import { Router } from "express"
import auth from "../middleware/auth.js"
import upload from "../middleware/upload.js"
import {
  createPost,
  getFeed,
  getUserPosts,
  deletePost,
  likePost,
  commentPost,
} from "../controllers/postsController.js"

const r = Router()

// Feed (all posts)
r.get("/", auth, getFeed)

// User-specific posts
r.get("/user/:userId", auth, getUserPosts)

// ✅ Create a new post (with optional image/file)
r.post("/", auth, upload.single("file"), createPost)

// Delete a post
r.delete("/:id", auth, deletePost)

// Like/unlike a post
r.post("/:id/like", auth, likePost)

// Comment on a post
r.post("/:id/comment", auth, commentPost)

export default r
