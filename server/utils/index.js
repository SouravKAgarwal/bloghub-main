import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export const hashString = async (userValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashedpassword = await bcrypt.hash(userValue, salt);
  return hashedpassword;
};

export const compareString = async (userPassword, password) => {
  try {
    const isMatch = await bcrypt?.compare(userPassword, password);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

export function generateOTP() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number

  let randomNumber;

  randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

export function generateToken(res, userId) {
  const token = JWT.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  return token;
}
