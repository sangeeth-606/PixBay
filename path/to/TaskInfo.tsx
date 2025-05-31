interface TaskInfoProps {
    taskId: string;
    title: string;
    description?: string;
    type?: string;
    priority: Priority;
    dueDate?: string;
    assigneeId: string;
    darkMode: boolean;
    onClose: () => void;
    onTaskDeleted: () => void;
    onDescriptionUpdated: (newDescription: string) => void;
} 