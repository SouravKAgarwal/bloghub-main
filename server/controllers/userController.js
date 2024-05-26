import Verification from "../models/emailVerification.js";
import Followers from "../models/followersModel.js";
import Users from "../models/userModel.js";
import { compareString, generateToken } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const OTPVerification = async (req, res, next) => {
  try {
    const { userId, otp } = req.params;

    const result = await Verification.findOne({ userId });

    if (result) {
      var { expiresAt, token } = result;
      if (expiresAt < Date.now()) {
        await Verification.findOneAndDelete({ userId });

        const message = "Verification token has expired.";
        res.status(404).json({ message });
      } else {
        const isMatch = await compareString(otp, token);

        if (isMatch) {
          await Promise.all([
            Users.findOneAndUpdate({ _id: userId }, { emailVerified: true }),
            await Verification.findOneAndDelete({ userId }),
          ]);

          const message = "Email verified successfully";
          res.status(200).json({ message });
        } else {
          const message = "Verification failed or link is invalid";
          res.status(404).json({ message });
        }
      }
    } else {
      const message = "Verification token has expired or account is verified.";
      res.status(404).json({ message });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Verification.findOneAndDelete({ userId: id });

    const user = await Users.findById(id);

    user.password = undefined;

    const token = generateToken(res, user?._id);

    if (user?.accountType === "Writer") {
      sendVerificationEmail(user, res, token);
    } else res.status(404).json({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const followWriter = async (req, res, next) => {
  try {
    const followerId = req.body.user.userId;
    const { id } = req.params;

    const check = await Users.findOne({ followers: followerId });

    if (check)
      return res.status(201).json({
        success: false,
        message: "You're already following this writer.",
      });

    const writer = await Users.findById(id);

    const newFollower = await Followers.create({
      followerId,
      writerId: id,
    });

    writer?.followers?.push(newFollower?._id);

    await Users.findByIdAndUpdate(id, writer, { new: true });

    res.status(201).json({
      success: true,
      message: "You're now following writer " + writer?.name,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const unFollowWriter = async (req, res, next) => {
  try {
    const followerId = req.body.user.userId;
    const { id } = req.params;

    const check = await Followers.findOne({ followerId });

    if (check) {
      const writer = await Users.findById(id);

      const unFollower = await Followers.deleteOne({
        followerId,
        writerId: id,
      });

      writer?.followers?.pop(unFollower?._id);

      await Users.findByIdAndUpdate(id, writer);

      res.status(201).json({
        success: true,
        message: "You have unfollowed writer " + writer?.name,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { firstName, lastName, email, image } = req.body;

    if (!(firstName || lastName || email || image)) {
      return next("Please provide all required fields");
    }

    const updateUser = {
      name: firstName + " " + lastName,
      email,
      image,
      _id: userId,
    };

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    const token = generateToken(res, user?._id);

    user.password = undefined;

    res.status(200).json({
      sucess: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getWriter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id).populate({
      path: "followers",
      select: "followerId",
    });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Writer Not Found",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const user = await Users.findByIdAndDelete(userId);
    res.status(400).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
