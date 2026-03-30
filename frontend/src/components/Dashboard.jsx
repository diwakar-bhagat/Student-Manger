import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Clock, Plus, Filter, Search } from 'lucide-react';
import api from '../api';
import { format } from 'date-fns';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', deadline: '' });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', deadline: '' });
      fetchTasks();
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task');
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
  };

  const filteredTasks = tasks
    .filter(t => {
      if (filter === 'Completed') return t.status === 'Completed';
      if (filter === 'Pending') return t.status === 'Pending';
      if (filter === 'High' || filter === 'Medium' || filter === 'Low') return t.priority === filter;
      return true;
    })
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="dashboard-container">
      <header style={{ margin: '-2rem -2rem 2rem', borderRadius: '0 0 16px 16px' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Smart Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{JSON.parse(localStorage.getItem('user'))?.username}</span>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--high-priority)' }}>Logout</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Tasks</p>
          <h3 style={{ fontSize: '2rem' }}>{stats.total}</h3>
        </div>
        <div className="stat-card">
          <p style={{ color: 'var(--low-priority)', marginBottom: '0.5rem' }}>Completed</p>
          <h3 style={{ fontSize: '2rem' }}>{stats.completed}</h3>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--high-priority)' }}>
          <p style={{ color: 'var(--high-priority)', marginBottom: '0.5rem' }}>Pending</p>
          <h3 style={{ fontSize: '2rem' }}>{stats.pending}</h3>
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: 'none', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Create New Task</h3>
        <form onSubmit={handleAddTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Task Name</label>
            <input
              className="input-field"
              style={{ marginBottom: 0, marginTop: '0.4rem' }}
              placeholder="e.g. Finish Math Assignment"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deadline</label>
            <input
              className="input-field"
              style={{ marginBottom: 0, marginTop: '0.4rem' }}
              type="date"
              value={newTask.deadline}
              onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Add Task
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Completed', 'High', 'Medium', 'Low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                background: filter === f ? 'var(--accent-color)' : 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                color: filter === f ? 'white' : 'var(--text-secondary)',
                fontSize: '0.8rem'
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            className="input-field"
            style={{ marginBottom: 0, paddingLeft: '40px', width: '250px' }}
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No tasks found. Start by adding one!
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task._id} className="task-card" style={{ opacity: task.status === 'Completed' ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle
                  size={24}
                  style={{ cursor: 'pointer', color: task.status === 'Completed' ? 'var(--low-priority)' : 'var(--text-secondary)' }}
                  onClick={() => toggleComplete(task)}
                />
                <div>
                  <h4 style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} /> Due: {format(new Date(task.deadline), 'PPP')}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                <Trash2
                  size={20}
                  style={{ cursor: 'pointer', color: 'var(--high-priority)' }}
                  onClick={() => deleteTask(task._id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
