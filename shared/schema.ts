import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gestures = pgTable("gestures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  region: varchar("region", { length: 10 }).notNull(),
  gestureText: text("gesture_text").notNull(),
  translatedText: text("translated_text").notNull(),
  confidence: real("confidence").notNull(),
  isEmergency: boolean("is_emergency").default(false),
  latency: integer("latency").notNull(), // in milliseconds
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGestureSchema = createInsertSchema(gestures).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGesture = z.infer<typeof insertGestureSchema>;
export type Gesture = typeof gestures.$inferSelect;
