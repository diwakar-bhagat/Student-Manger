const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../mock-db.json');

const loadData = () => {
  if (!fs.existsSync(DB_FILE)) return { users: [], tasks: [] };
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { users: [], tasks: [] };
  }
};

const saveData = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const mockDb = {
  users: {
    findByEmail: (email) => {
      const data = loadData();
      return data.users.find(u => u.email === email);
    },
    save: async (userData) => {
      const data = loadData();
      const newUser = { ...userData, _id: Date.now().toString() };
      data.users.push(newUser);
      saveData(data);
      console.log(`[MockDB] User sign up: ${userData.email}`);
      return newUser;
    },
    comparePassword: async (candidate, hash) => await bcrypt.compare(candidate, hash)
  },
  tasks: {
    find: (userId) => {
      const data = loadData();
      return data.tasks.filter(t => t.user === userId);
    },
    save: (taskData) => {
      const data = loadData();
      const newTask = { ...taskData, _id: Date.now().toString() };
      data.tasks.push(newTask);
      saveData(data);
      console.log(`[MockDB] Task created for user: ${taskData.user}`);
      return newTask;
    },
    update: (id, userId, updateData) => {
      const data = loadData();
      const index = data.tasks.findIndex(t => t._id === id && t.user === userId);
      if (index === -1) return null;
      data.tasks[index] = { ...data.tasks[index], ...updateData };
      saveData(data);
      return data.tasks[index];
    },
    delete: (id, userId) => {
      const data = loadData();
      const index = data.tasks.findIndex(t => t._id === id && t.user === userId);
      if (index === -1) return false;
      data.tasks.splice(index, 1);
      saveData(data);
      return true;
    }
  }
};

module.exports = mockDb;
