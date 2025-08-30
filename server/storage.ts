import { type User, type InsertUser, type Gesture, type InsertGesture } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createGesture(gesture: InsertGesture): Promise<Gesture>;
  getGesturesByRegion(region: string): Promise<Gesture[]>;
  getRecentGestures(limit?: number): Promise<Gesture[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gestures: Map<string, Gesture>;

  constructor() {
    this.users = new Map();
    this.gestures = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGesture(insertGesture: InsertGesture): Promise<Gesture> {
    const id = randomUUID();
    const gesture: Gesture = { 
      ...insertGesture,
      userId: insertGesture.userId || null,
      isEmergency: insertGesture.isEmergency || false,
      id,
      timestamp: new Date()
    };
    this.gestures.set(id, gesture);
    return gesture;
  }

  async getGesturesByRegion(region: string): Promise<Gesture[]> {
    return Array.from(this.gestures.values())
      .filter(gesture => gesture.region === region)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async getRecentGestures(limit: number = 10): Promise<Gesture[]> {
    return Array.from(this.gestures.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
