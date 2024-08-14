import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    mobileNumber: text("mobile_number"),
    boards: text("boards").array(),
});

export const boards = pgTable("boards", {
    id: uuid('id').primaryKey().defaultRandom(),
    name:text('name').notNull().unique(),
    createdBy: text("created_by"),
    currentParticipants: text("current_participants").array(),
    password: text("password").notNull(),
});
