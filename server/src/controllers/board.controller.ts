import db from "../db";
import { Request, Response } from "express";
import { boards, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { comparePassword, hashPassword } from "../lib/utils";

export const createBoard = async (req: Request, res: Response) => {
    const { id, createdBy, name, password } = req.body;

    const hashedPassword = await hashPassword(password)

    try {
        const [board] = await db
            .insert(boards)
            .values({
                id,
                name,
                createdBy,
                password: hashedPassword,
            })
            .returning();

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, createdBy));

        const updatedBoards = user.boards ? [...user.boards, id] : [id];

        await db
            .update(users)
            .set({
                boards: updatedBoards,
            })
            .where(eq(users.id, createdBy));

        return res.json({ isSuccess: true, board });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isSuccess: false, message: "Error in creating board", error });
    }
};


export const joinBoard = async (req: Request, res: Response) => {

    const { id, boardId, password } = req.body;

    const [existingBoard] = await db.select().from(boards);

    if (existingBoard.createdBy === id) {
        return res.json({ isSuccess: false, message: "Your a host, not a participants" })
    }

    const verify = await comparePassword(password, existingBoard.password)

    if (!verify) {
        return res.json({ isSuccess: false, message: "Incorrect Password" });
    }

    try {
        const updateParticipants = existingBoard.currentParticipants ? [...existingBoard.currentParticipants] : [id];
        const [board] = await db
            .update(boards)
            .set({
                currentParticipants: updateParticipants
            })
            .where(eq(boards.id, boardId)).returning()


        return res.json({ isSuccess: true, board });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isSuccess: false, message: "Error in joining board", error });
    }
};


export const getBoard = async (req: Request, res: Response) => {

    const { id } = req.params;
    try {
        const userBoards = await db
            .select()
            .from(boards)
            .where(eq(boards.id, id));
        console.log(userBoards)
        return res.status(201).json({ userBoards });
    } catch (error) {
        res.status(500).json({ message: "Error in fetching board", error });
    }

};

export async function removeParticipant(req: Request, res: Response) {
    const { id } = req.params;
    const participantId = req.body.id
    const board = await db.select().from(boards)
        .where(eq(boards.id, id))
        .limit(1)


    const updatedParticipants = board[0].currentParticipants?.filter(participant => participant !== participantId);

    await db.update(boards)
        .set({
            currentParticipants: updatedParticipants,
        })
        .where(eq(boards.id, id));
}

