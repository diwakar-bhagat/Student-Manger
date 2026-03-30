import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DemoDashboard from './components/DemoDashboard';
import { demoTasks, demoUser } from './demoData';

function DemoApp() {
  const [tasks, setTasks] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    // Load demo tasks
    setTasks(demoTasks);
  }, []);

  const handleTaskToggle = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    );
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
  };

  const handleTaskAdd = (newTask) => {
    const task = {
      ...newTask,
      _id: Date.now().toString(),
      status: 'pending',
      priority: calculatePriority(new Date(newTask.deadline))
    };
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const calculatePriority = (deadline) => {
    const now = new Date();
    const timeDiff = deadline - now;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 2) return 'high';
    if (daysDiff <= 5) return 'medium';
    return 'low';
  };

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h1>🎓 Student Task Manager (Demo Mode)</h1>
          <p>This is a demo version running on GitHub Pages. Backend features like authentication and data persistence are not available.</p>
          <p><strong>User:</strong> {demoUser.name} | <strong>Email:</strong> {demoUser.email}</p>
        </div>
        
        <Routes>
          <Route 
            path="/" 
            element={
              <DemoDashboard 
                tasks={tasks}
                onTaskToggle={handleTaskToggle}
                onTaskDelete={handleTaskDelete}
                onTaskAdd={handleTaskAdd}
                isDemoMode={isDemoMode}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default DemoApp;
