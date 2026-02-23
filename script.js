const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = [];
let filter = 'all';

// Load tasks from localStorage
window.onload = function() {
  const saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);
  renderTasks();
};

// Add task
addBtn.onclick = function() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.classList.add('invalid');
    setTimeout(() => taskInput.classList.remove('invalid'), 500);
    return;
  }
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveAndRender();
};

// Enter key adds task
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addBtn.click();
});

// Toggle complete
taskList.onclick = function(e) {
  if (e.target.classList.contains('task-checkbox')) {
    const idx = e.target.closest('li').dataset.index;
    tasks[idx].completed = !tasks[idx].completed;
    saveAndRender();
  }
  if (e.target.classList.contains('delete-btn')) {
    const idx = e.target.closest('li').dataset.index;
    tasks.splice(idx, 1);
    saveAndRender();
  }
};

// Filter buttons
filterBtns.forEach(btn => {
  btn.onclick = function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTasks();
  };
});

function renderTasks() {
  taskList.innerHTML = '';
  let filtered = tasks;
  if (filter === 'active') filtered = tasks.filter(t => !t.completed);
  if (filter === 'completed') filtered = tasks.filter(t => t.completed);
  filtered.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.index = tasks.indexOf(task);
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-text">${task.text}</span>
      <button class="delete-btn" title="Delete">&times;</button>
    `;
    taskList.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}