import { 
  type FormSubmission, 
  type InsertFormSubmission,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Form submissions
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  getAllFormSubmissions(): Promise<FormSubmission[]>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private formSubmissions: Map<string, FormSubmission>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.formSubmissions = new Map();
    this.chatMessages = new Map();
  }

  // Form submissions
  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    const id = randomUUID();
    const submission: FormSubmission = {
      ...insertSubmission,
      id,
      submittedAt: new Date(),
    };
    this.formSubmissions.set(id, submission);
    return submission;
  }

  async getAllFormSubmissions(): Promise<FormSubmission[]> {
    return Array.from(this.formSubmissions.values()).sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
    );
  }

  // Chat messages
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      sentAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.sessionId === sessionId)
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  }
}

export const storage = new MemStorage();
