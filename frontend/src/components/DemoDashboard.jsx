import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Clock, Plus, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

const DemoDashboard = ({ tasks, onTaskToggle, onTaskDelete, onTaskAdd, isDemoMode }) => {
  const [newTask, setNewTask] = useState({ title: '', deadline: '' });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'All' || 
      (filter === 'Completed' && task.status === 'completed') ||
      (filter === 'Pending' && task.status === 'pending');
    
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;
    
    onTaskAdd({
      title: newTask.title,
      description: 'Demo task description',
      deadline: newTask.deadline
    });
    
    setNewTask({ title: '', deadline: '' });
    setShowAddForm(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            >
              <option value="All">All Tasks</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
            <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              />
              <input
                type="datetime-local"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all hover:bg-white/15 ${
                task.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-2 ${
                    task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-white/70 mb-3">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/50">
                      📅 {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
                    </span>
                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onTaskToggle(task._id)}
                    className={`p-3 rounded-lg transition-all ${
                      task.status === 'completed'
                        ? 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onTaskDelete(task._id)}
                    className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg">No tasks found. Add your first task!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;
