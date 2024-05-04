import express from "express";
import auth from "../library/middlewares/auth";
import { upload } from "../library/helpers/uploadImage";
import {
  createPost,
  updatePost,
  getPost,
  getUserPost,
  deleteSinglePost,
  singlePost,
} from "../controllers/blogController";

const router = express.Router();

/* GET home page. */
router.post("/create_post", auth, upload.array("pictures", 6), createPost);
router.put("/update_post/:id", auth, upload.array("pictures", 6), updatePost);
router.get("/get_all_post", auth, getPost);
router.get("/get_single_post/:id", auth, singlePost);
router.get("/get_user_posts/:id", auth, getUserPost);
router.delete("/delete_single_posts/:id", auth, deleteSinglePost);

export default router;
