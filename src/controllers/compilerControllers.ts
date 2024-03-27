import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Code from "../models/Code";
import User from "../models/User";
import { AuthRequest } from "../middlewares/verfiyAuthToken";

export const createCode = async (req: AuthRequest, res: Response) => {
  try {
    let ownerName = "Anonymous";
    let user = undefined;
    let ownerInfo = undefined;
    let isAuthenticated = false;
    if (req._id) {
      user = await User.findById(req._id);
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }
      ownerName = user?.username;
      ownerInfo = user._id;
      isAuthenticated = true;
    }

    const newCode = await Code.create({
      fullCode: {
        html: "html code!",
        css: "css code!",
        javascript: "js code!",
      },
      title: "Untitled Code!",
      ownerInfo: ownerInfo,
      ownerName: ownerName,
    });
    if (isAuthenticated && user) {
      user.savedCodes.push(newCode._id);
      await user.save();
    }
    res
      .status(201)
      .json({
        url: newCode._id,
        fullCode: newCode.fullCode,
        title: newCode.title,
      });
  } catch (error) {
    console.log(error);
  }
};
export const saveCode = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { fullCode, codeId, title } = req.body;

    const findCode = await Code.findById(codeId);
    if (findCode === null) {
      let data = await Code.create({
        fullCode: fullCode,
        title: "Untitled Code",
      });
      await data?.save();
      res.status(200).json({ url: data?._id, success: true });
    } else {
      let data = await Code.findByIdAndUpdate(
        codeId,
        {
          fullCode,
          title,
        },
        { new: true }
      );
      await data?.save();
      res.status(200).json({ url: data?._id, success: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Error saving code", error });
    console.log(error);
  }
});

export const getCode = async (req: AuthRequest, res: Response) => {
  try {
    const { codeId } = req.body;
    const userId = req._id;
    let isOwner = false;
    const findCode = await Code.findById(codeId);
    if (!findCode) {
      return res.status(400).json({ message: "Not found Code" });
    }
    const user = await User.findById(userId);
    const codeOwerId =  findCode.ownerInfo;
    if (user?._id.toString() ===codeOwerId.toString() ) {
      isOwner = true;
    }
    return res.status(200).send({ fullCode: findCode.fullCode, isOwner,title:findCode?.title });
  } catch (error) {
    res.status(500).json({ message: "Error saving code", error });
    console.log(error);
  }
};

// user

export const getMyCodes = async (req: AuthRequest, res: Response) => {
  const userId = req._id;
  try {
    const user = await User.findById(userId).populate({
      path: "savedCodes",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).send({ message: "Cannot find User!" });
    }
    return res.status(200).send(user.savedCodes);
  } catch (error) {
    return res.status(500).send({ message: "Error loading my codes!", error });
  }
};

export const deleteCode = async (req: AuthRequest, res: Response) => {
  const userId = req._id;
  const { id } = req.params;
  try {
    const owner = await User.findById(userId);
    if (!owner) {
      return res
        .status(404)
        .send({ message: "Cannot find the owner profile!" });
    }
    const existingCode = await Code.findById(id);
    if (!existingCode) {
      return res.status(404).send({ message: "Code not found" });
    }
    if (existingCode.ownerInfo.toString() !== owner._id.toString()) {
      return res
        .status(400)
        .send({ message: "You don't have permission to delete this code!" });
    }
    const deleteCode = await Code.findByIdAndDelete(id);
    if (deleteCode) {
      return res.status(200).send({ message: "Code Deleted successfully!" });
    } else {
      return res.status(404).send({ message: "Code not found" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error deleting code!", error });
  }
};

export const getAllCodes = async (req: Request, res: Response) => {
  try {
    const allCodes = await Code.find().sort({ createdAt: -1 });
    return res.status(200).send(allCodes);
  } catch (error) {
    return res.status(500).send({ message: "Error editing code!", error });
  }
};
