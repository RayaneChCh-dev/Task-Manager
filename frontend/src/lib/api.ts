import { TaskStats } from "./types";

const API_BASE_URL = 'http://localhost:3000';

// REST API functions
export async function getTasks(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  
  const tasks = await response.json();
  return tasks.map((task: any) => ({
    ...task,
    createdAt: new Date(task.createdAt), // Ensure `createdAt` is parsed as a Date
    category: task.category || "general",
    completed: task.completed ?? false,
  }));
}

export async function createTask(title: string, description: string, category: string): Promise<any> {
  // Input validation
  if (!title || !description) {
    throw new Error('Title and Description are required');
  }

  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, description }),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
}

export async function updateTask(id: string, title: string, description: string): Promise<any> {
  if (!title || !description) {
    throw new Error('Title and Description are required');
  }

  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
}

export async function deleteTask(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) throw new Error('Failed to delete task');
  
  // Handle both 204 and JSON responses
  if (response.status === 204) {
    return { success: true };
  }
  return response.json();
}

export async function toggleTask(id: string, completed: boolean): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed }) // Ensure toggling is handled
  });

  if (!response.ok) throw new Error("Failed to toggle task completion");
  return response.json();
}

export const rpc = {
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await fetch(`${API_BASE_URL}/rpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "getTaskStats",
        params: [],
        id: 1
      })
    });
    
    if (!response.ok) throw new Error('Failed to fetch stats');
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.result;
  }
};
