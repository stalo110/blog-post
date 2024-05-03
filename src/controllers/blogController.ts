import { Request, Response } from "express";
import { creatBlogPostSchema, updateBlogPostSchema, option } from "../utils/utils";
import Blog from "../model/BlogPostModel";
import { v2 as cloudinaryV2 } from "cloudinary";

export const createPost = async (req: Request | any, res: Response) => {
  try {
    const verify = req.user;

    //validate Post form inputs
    const validateUser = creatBlogPostSchema.validate(req.body, option);

    if (validateUser.error) {
      res.status(400).json({ Error: validateUser.error.details[0].message });
    }

    let links = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      // Upload images to Cloudinary and retrieve their URLs
      links = await Promise.all(req.files.map(async (item: Record<string, any>) => {
        const result = await cloudinaryV2.uploader.upload(item.path);
        return result.secure_url;
      }));
    }


    const newPost = await Blog.create({
      ...validateUser.value,
      user: verify._id,
      pictures: links.join(","),
    });

    return res
      .status(200)
      .json({ message: "Blog Post created successfully", newPost });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { pictures, ...rest } = req.body;
    const { id } = req.params;
    //validate Post form inputs
    const validateUser = updateBlogPostSchema.validate(req.body, option);

    if (validateUser.error) {
      res.status(400).json({ Error: validateUser.error.details[0].message });
    }

    const Post = await Blog.findById({ _id: id });

    if (!Todo) {
      return res.status(400).json({
        error: "Post not found",
      });
    }
    const updateRecord = await Blog.findByIdAndUpdate(id,
      {
        ...rest,
        pictures,
    
      },

      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updateRecord) {
      return res.status(404).json({
        msg: "Post not updated",
      });
    }

    return res.status(200).json({
      message: "Post updates successfully",
      updateRecord,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const getAllUserPost = await Blog.find().populate("user");

    res.status(200).json({
      msg: "Post successfully fetched",
      getAllUserPost,
    });
  } catch (error) {
    console.log(error);
  }
};

export const singlePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const getsinglePost = await Blog.findById(id);

    if (!getsinglePost) {
      return res.status(400).json({
        error: "Post not found",
      });
    }
    res.status(200).json({
      msg: "Post successfully fetched",
      getsinglePost
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const getAllUserPost = await Blog.find({ user: userId });

    res.status(200).json({
      msg: "Post successfully fetched",
      getAllUserPost,
    });
  } catch (error) {
    console.log(error);
  }
};



export const deleteSinglePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteSingleRecord = await Blog.findByIdAndDelete(id)
    if (!deleteSingleRecord) {
      return res.status(400).json({
        error: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post successfully deleted",
      deleteSingleRecord
    });
  } catch (error) {
    console.error("Problem deleting Todo");
  }
};
