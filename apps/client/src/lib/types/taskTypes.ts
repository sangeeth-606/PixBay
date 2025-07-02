export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  ARCHIVED = "ARCHIVED",
}

export enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum TaskType {
  TASK = "TASK",
  BUG = "BUG",
  STORY = "STORY",
  EPIC = "EPIC",
}

export interface User {
  id: string;
  userId?: string;
  name: string | null;
  email: string | null;
  exists?: boolean;
  hasName?: boolean;
  role?: string;
  joinedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  creator: User;
  assignee?: User | null;
  projectId: string;
  type?: string;
  name?: string;
}
