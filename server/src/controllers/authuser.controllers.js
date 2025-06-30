import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefereshTokens } from "./token.controllers.js";

const registerUser = asyncHandler( async(req, res) => {
  
    // get user details from frontend
    const { name, email, password, profileImageUrl, adminInviteToken } = req.body
    

    let role = "member"
    if (
        adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN
    ) {
        role = "admin";
    }

    // validation - not empty
    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")
    }

    // check if user already exists: username, email
    const existeduser = await User.findOne({ email })

    if (existeduser) {
        throw new ApiError(409, "User with email already exists")
    }

    // // check for images, check for avatar
    // const avatarLocalPath = req.files?.avatar[0]?.path
    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }

    // if(!avatarLocalPath){
    //     throw new ApiError(400, "Avatar file is required")
    // }

    // // upload them to cloudinary, avatar
    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // console.log(avatar)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar on cloud file is required")  
    // }

    // check for user creation
    const user = await User.create({
        name,
        email,
        password,
        role,
        profileImageUrl
        
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(500, "Something went wrong while registring the user")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

} )

// login User Controller

const loginUser = asyncHandler(async (req, res) => {


    // get user details from frontend
    const { email,password} = req.body
    
    // validation - not empty
    if (!email ) {
        throw new ApiError(400, "username or email is required for login")
    }

    // check if user exists: username, email
    const user = await User.findOne({ email }) 
    

    if (!user) {
        throw new ApiError(404, "User does not exist")
        
    }

    // check for password
    const isPasswordVaild = await user.isPasswordCorrect(password)

    if (!isPasswordVaild) {
        throw new ApiError(401, "Invalid user credentials")        
    }

    // create access token and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true
    }

    // return res
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            user: loggedInUser,
        }, "User logged In Successfully"
    ))   
})

// logout User Controller

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken:  "" // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

// Endpoint for refreshAccessToken

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthoried request")

    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
            )

            const user = await User.findById(decodedToken?._id)

            if (!user) {
                throw new ApiError(401, "Invalid  Refresh Token")
                
            }

            if (incomingRefreshToken !== user?.refreshToken) {
                throw new ApiError(401, "Refresh Token Is Expired or used")
                
            }

            const{accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)

            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )

        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid Refresh Token")
        
    }
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    if (oldPassword == newPassword) {
        throw new ApiError(406, "New Password is same Old Password ")
        
    }

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getUserProfiletUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
});

const updateUserProfile = asyncHandler(async(req, res) => {

    const user = await User.findById(req.user?._id)
    
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    await user.save({validateBeforeSave: false})  
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
});




export { 
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   changeCurrentPassword,
   getUserProfiletUser
}