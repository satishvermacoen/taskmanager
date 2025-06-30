import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.js";
import Task from "../models/task.js"

import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefereshTokens } from "./token.controllers.js";

const getUsers = async (_, res) => {
    try {
    
        const users = await User.find({ role:"member" }).select("-password");
    
        // Add task count to each user
        const usersWithtaskCount = await Promise.all(
          users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending",
                });
                
            const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress",
                });
                
            const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "completed",
                });
    
            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            };

        }));

            res.json(usersWithtaskCount);
    
    } catch (error) {
    res.status(500).json({message: "Server to get all users error", error: error.message});

    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({message: "User not found"});
        res.json(user);

    } catch (error) {
        res.status(500).json({message: "Server to get id Error", error: error.message })
    }
    
};


const deleteUser = asyncHandler( async(req, res) => {

    return res.status(201).json(
        new ApiResponse(200, mesage, "")
    )
});



export { 
  getUsers,
  getUserById,
  deleteUser
}