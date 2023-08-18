import express from 'express';
import mongoose from 'mongoose'
import blogModel from '../models/Blog'
import userModel from '../models/User'

export const getAllBlogs = async (req,res,next) => {
    let blogs;
    try {
        blogs = await blogModel.find();
    } catch (error) {
        console.log(err);
    }

    if(!blogs){
       return res.status(404).json({message: "No Blogs Found"});
    }

    return res.status(200).json({blogs});
}

export const addBlog = async (req,res,next) => {
   const {title, description, image, user} = req.body;

   let existingUser;
   try {
    existingUser = await userModel.findById(user)
   } catch (error) {
    console.log(error);
   }

   if(!existingUser){
    return res.status(400).json({message: "Couldn't find a user with this Id"})
   }

   const newBlog = new blogModel({
    title,
    description,
    image,
    user,
   })

   try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();
   } catch (error) {
    console.log(error)
    res.status(500).json({message: error})
   }

   res.status(200).json({newBlog})
}

export const updateBlog = async (req,res,next) => {
    const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;
  try {
    blog = await blogModel.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable To Update The Blog" });
  }
  return res.status(200).json({ blog });
}

export const getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
      blog = await blogModel.findById(id);
    } catch (err) {
      return console.log(err);
    }
    if (!blog) {
      return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({ blog });
  };

  export const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
  
    let blog;
    try {
      blog = await blogModel.findByIdAndRemove(id).populate("user");
      await blog.user.blogs.pull(blog);
      await blog.user.save();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unable To Delete" });
    }

    return res.status(200).json({ message: "Successfully Delete" });
  };

  export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
      userBlogs = await userModel.findById(userId).populate("blogs");
    } catch (err) {
      return console.log(err);
    }
    if (!userBlogs) {
      return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({ user: userBlogs });
  };