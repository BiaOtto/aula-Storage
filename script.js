const zones = document.querySelectorAll('.zone');

function enableDrag(el) {
  el.setAttribute('draggable', true);
  el.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', el.id);
    el.classList.add('dragging');
  });

  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
  });
}

zones.forEach((zone) => {
  zone.addEventListener('dragenter', (event) => {
    event.preventDefault();
    zone.classList.add('over');
  });

  zone.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('over');
  });

  zone.addEventListener('drop', (event) => {
    const draggedId = event.dataTransfer.getData('text/plain');
    const draggedEl = document.getElementById(draggedId);
    zone.appendChild(draggedEl);
    zone.classList.remove('over');
    saveTasks();
  });
});

function createTaskElement(id, text) {
  const task = document.createElement('div');
  task.id = id;
  task.className = 'draggable';

  const span = document.createElement('span');
  span.textContent = text;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '❌';
  removeBtn.className = 'remove-btn';
  removeBtn.addEventListener('click', () => {
    task.remove();
    saveTasks();
  });

  task.appendChild(span);
  task.appendChild(removeBtn);
  enableDrag(task);
  return task;
}

function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();
  if (!taskText) return;

  const taskId = 'task-' + Date.now();
  const taskEl = createTaskElement(taskId, taskText);
  document.getElementById('startZone').appendChild(taskEl);
  input.value = '';
  saveTasks();
}

function saveTasks() {
  const tasks = [];

  document.querySelectorAll('.zone').forEach((zone) => {
    const zoneId = zone.id;
    zone.querySelectorAll('.draggable').forEach((task) => {
      const span = task.querySelector('span');
      tasks.push({
        id: task.id,
        text: span ? span.textContent : '',
        zone: zoneId
      });
    });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.forEach(({ id, text, zone }) => {
    const el = createTaskElement(id, text);
    const zoneEl = document.getElementById(zone);
    if (zoneEl) {
      zoneEl.appendChild(el);
    }
  });
}

function saveName() {
  const name = document.getElementById('username').value;
  localStorage.setItem('username', name);
  showWelcomeMessage();
}

function showWelcomeMessage() {
  const savedName = localStorage.getItem('username');
  if (savedName) {
    document.getElementById('welcomeMsg').textContent = `👋🏻 Bem-vindo de volta, ${savedName}!`;
  }
}

function countVisits() {
  let visits = parseInt(localStorage.getItem('visits')) || 0;
  visits++;
  localStorage.setItem('visits', visits);
  document.getElementById('visitCounter').textContent = `🕵🏼‍♀️ Visitas a esta página: ${visits}`;
}

function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme;
  }
}

window.onload = () => {
  applySavedTheme();
  showWelcomeMessage();
  countVisits();
  loadTasks();
};
