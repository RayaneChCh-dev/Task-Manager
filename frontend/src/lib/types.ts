export interface Task {
  id: string;  // Change from number to string
  title: string;
  description: string;
  category: string;
  createdAt: Date;
  completed: boolean;
}

  
export interface TaskListProps {
    tasks: Task[];
    toggleTask: (id: string, completed: boolean) => void;
    deleteTask: (id: string) => void;
    updateTask: (id: string, title: string, description: string) => void;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  categories?: Record<string, number>;
}

export interface Categories {
    [key: string]: string;
}

export interface Category {
    id: string;
    color: string;
}


