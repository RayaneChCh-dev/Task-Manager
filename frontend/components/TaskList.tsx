// TaskList.tsx
import React, { useState } from "react";
import { TaskListProps } from "../src/lib/types";
import { Trash2, CheckCircle, Circle, Edit3, Save } from "lucide-react";
import CardWrapper from "./CardWrapper";

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTask, deleteTask, updateTask }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");

  return (
    <div className="flex flex-col space-y-6">
      {tasks.map((task) => (
        <CardWrapper 
          key={task.id} 
          category={task.category}
        >
          <div className="flex items-center">
            <div className="flex flex-col flex-grow w-full gap-2">
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              ) : (
                <p className={`text-lg font-semibold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </p>
              )}

              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              ) : (
                <p className={`text-gray-600 ${task.completed ? 'text-gray-400 line-through' : ''}`}>
                  {task.description}
                </p>
              )}

              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                (() => {
                  switch(task.category) {
                    case 'work': return 'bg-blue-100 text-blue-800';
                    case 'personal': return 'bg-purple-100 text-purple-800';
                    case 'shopping': return 'bg-green-100 text-green-800';
                    case 'health': return 'bg-red-100 text-red-800';
                    default: return 'bg-gray-100 text-gray-800';
                  }
                })()
              }`}>
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </span>
            </div>

            <div className="flex items-center space-x-3 ml-auto gap-4">
              <button
                onClick={() => toggleTask(task.id, task.completed)}
                className={`transition-all duration-200 ${
                  task.completed ? "text-green-600 hover:text-green-800" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>

              {editingTaskId === task.id ? (
                <button
                  onClick={() => {
                    updateTask(task.id, editedTitle, editedDescription);
                    setEditingTaskId(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                >
                  <Save className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditedTitle(task.title);
                    setEditedDescription(task.description);
                  }}
                  className="text-yellow-600 hover:text-yellow-800 transition-all duration-200"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}

              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-red-600 hover:text-red-800 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardWrapper>
      ))}
    </div>
  );
};

export default TaskList;