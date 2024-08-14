import db from "../db";
import { Request, Response } from "express";
import { boards, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { comparePassword, hashPassword } from "../lib/utils";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, mobileNumber } = req.body;

  let existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser && existingUser.length > 0) {
    return res.status(303).json({ isSuccess: false, message: "Email already Registered with an user, Login to continue" })
  }

  const hashedPassword = await hashPassword(password);

  try {
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        mobileNumber,
        password: hashedPassword,
      })
      .returning();
    res.status(201).json({ message: "Account Created Successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user, try again later." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let userInfo = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!users || userInfo.length === 0) {
      return res.status(404).json({ message: "users not found" });
    }

    const userBoards = await db.select().from(boards).where(eq(boards.createdBy, userInfo[0].id))

    console.log(userBoards)

    const isPasswordValid = await comparePassword(password, userInfo[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password, try again" });
    }
    res.status(201).json({ message: "Login Successful", user: userInfo[0], userBoards });
  } catch (error) {
    res.status(500).json({ message: "Failed to Login, try again." });
  }
};
