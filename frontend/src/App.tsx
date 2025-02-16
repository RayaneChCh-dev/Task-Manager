import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, TaskStats } from "../src/lib/types";
import { PlusCircle, Layout, Tag } from "lucide-react";
import * as api from "../src/lib/api";
import TaskList from "../components/TaskList";
import {  } from "lucide-react";

const categories = [
  { id: 'work', color: 'bg-blue-100 text-blue-800' },
  { id: 'personal', color: 'bg-purple-100 text-purple-800' },
  { id: 'shopping', color: 'bg-green-100 text-green-800' },
  { id: 'health', color: 'bg-red-100 text-red-800' },
  { id: 'notes', color: 'bg-yellow-100 text-yellow-800' },
];
export function App() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: api.getTasks,
  });
  
  const { data: stats } = useQuery<TaskStats>({
    queryKey: ["taskStats"],
    queryFn: api.rpc.getTaskStats,
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ title, description, category }: { title: string; description: string; category: string,}) =>
      api.createTask(title, description, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      setNewTaskTitle("");
      setNewTaskDescription("");
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, title, description }: { id: string; title: string, description: string }) => api.updateTask(id, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      api.toggleTask(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: api.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTaskMutation.mutate({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        category: selectedCategory,
      });
    }
  };

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Layout className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          </div>
          
          {stats && (
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white/90 rounded-xl shadow-sm p-6 border border-indigo-100">
                <p className="text-sm font-medium text-indigo-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.total}</p>
              </div>
              <div className="bg-white/90 rounded-xl shadow-sm p-6 border border-green-100">
                <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <div className="bg-white/90 rounded-xl shadow-sm p-6 border border-amber-100">
                <p className="text-sm font-medium text-amber-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Title"
                className="rounded-md px-4 py-2 border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description"
                className="rounded-md px-4 py-2 border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg flex flex-wrap items-center gap-2 transition-colors ${
                      selectedCategory === category.id
                        ? category.color.replace('100', '200')
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    {category.id.charAt(0).toUpperCase() + category.id.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="flex justify-center items-center gap-2 w-full bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors"
            >
              <PlusCircle className="w-5 h-5"/>
            </button>
          </form>
          <TaskList
            tasks={tasks}
            toggleTask={(id: string, completed: boolean) => toggleTaskMutation.mutate({ id, completed })}
            deleteTask={(id: string) => deleteTaskMutation.mutate(id)}
            updateTask={(id: string, title: string, description: string) => updateTaskMutation.mutate({ id, title, description })}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
