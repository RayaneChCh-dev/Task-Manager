import express from 'express';
import cors from 'cors';
import { JSONRPCServer } from 'json-rpc-2.0';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage for tasks (Replace with DB in production)
let tasks: Task[] = [];

// Task type definition
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
}

// Task validation schema
const TaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional(),
});


app.get('/api/tasks', (_, res) => {
  res.json(tasks);
});


app.post('/api/tasks', (req: Request, res: Response): any => {
  const result = TaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid task data' });
  }

  const task: Task = {
    id: randomUUID(),
    title: result.data.title,
    description: result.data.description,
    category: result.data.category,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { title, description, completed } = req.body;  // Add completed to destructuring

  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // If title and description are provided, update them
  if (title && description) {
    task.title = title;
    task.description = description;
  }

  // If completed status is provided, update it
  if (typeof completed === 'boolean') {
    task.completed = completed;
  }

  res.json(task);
});


app.delete('/api/tasks/:id', (req: Request, res: Response): any => {
  const { id } = req.params; 
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  res.json(deletedTask);  // Send back the deleted task instead of 204
});

// JSON-RPC Server setup
const rpcServer = new JSONRPCServer();

// RPC methods
rpcServer.addMethod('toggleTask', ({ id }: { id: string }) => {
  const task = tasks.find(t => t.id === id);
  if (!task) {
    throw new Error('Task not found');
  }
  task.completed = !task.completed;
  return task;
});

rpcServer.addMethod('getTaskStats', () => {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    categories: tasks.reduce((acc, task) => {
      acc[task.category || 'uncategorized'] = (acc[task.category || 'uncategorized'] || 0) + 1;
      return acc;
    }, {}),
  };
});

// RPC endpoint
app.post('/rpc', async (req, res) => {
  const jsonRPCRequest = req.body;
  const response = await rpcServer.receive(jsonRPCRequest);
  if (response) {
    res.json(response);
  } else {
    res.sendStatus(204);
  }
});

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
