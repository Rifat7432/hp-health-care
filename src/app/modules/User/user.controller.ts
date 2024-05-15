import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async(req:Request,res:Response)=>{
   
   try {
    const result = await userService.createAdminIntoDB(req.body)
    return res.status(200).json({
      success: true,
      message: "admin found successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
}
export const userController = {
    createAdmin
}