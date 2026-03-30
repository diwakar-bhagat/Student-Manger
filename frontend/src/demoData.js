// Demo data for GitHub Pages deployment
export const demoTasks = [
  {
    _id: '1',
    title: 'Complete Math Assignment',
    description: 'Finish calculus homework chapter 5',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'high'
  },
  {
    _id: '2',
    title: 'Physics Lab Report',
    description: 'Write lab report on pendulum experiment',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'medium'
  },
  {
    _id: '3',
    title: 'Literature Essay',
    description: 'Essay on Shakespeare\'s Hamlet',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    priority: 'low'
  },
  {
    _id: '4',
    title: 'Chemistry Quiz Preparation',
    description: 'Study for organic chemistry quiz',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'high'
  }
];

export const demoUser = {
  name: 'Demo Student',
  email: 'demo@student.com'
};
