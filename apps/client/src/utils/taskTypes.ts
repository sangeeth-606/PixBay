export enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    ARCHIVED = "ARCHIVED",
  }
  
  export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
  }
  
  export interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    joinedAt: string;
  }
  
  export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: string;
    creator: User;
    assignee?: User | null; // Update type to User | null
    projectId: string;
    type?:string
    name?:string
  }