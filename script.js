document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskStartTime = document.getElementById('task-start');
  const taskEndTime = document.getElementById('task-end');
  const taskList = document.getElementById('task-list');

  // Carica le task dal localStorage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.startTime, task.endTime));
  };

  // Salva la task nel localStorage
  const saveTask = (text, startTime, endTime) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, startTime, endTime });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Rimuovi la task dal localStorage
  const removeTaskFromStorage = (text) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.text !== text);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Aggiungi la task al DOM
  const addTaskToDOM = (text, startTime, endTime) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const taskText = document.createElement('span');
    taskText.textContent = text;
    taskText.className = 'task-text';

    const taskTimeElement = document.createElement('span');
    taskTimeElement.textContent = `${startTime} - ${endTime}`;
    taskTimeElement.className = 'task-time';

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      const newTask = prompt('Edit task:', text);
      const newStartTime = prompt('Edit start time:', startTime);
      const newEndTime = prompt('Edit end time:', endTime);
      if (newTask && newStartTime && newEndTime) {
        taskText.textContent = newTask;
        taskTimeElement.textContent = `${newStartTime} - ${newEndTime}`;
        removeTaskFromStorage(text);
        saveTask(newTask, newStartTime, newEndTime);
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      taskList.removeChild(li);
      removeTaskFromStorage(text);
    });

    li.appendChild(taskText);
    li.appendChild(taskTimeElement);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    taskList.appendChild(li);

    // Ordina la lista ogni volta che viene aggiunta una task
    sortTasks();

    // Imposta il focus sull'input del task
    document.getElementById('task-input').focus();
  };

  // Ordina le task nel DOM in base all'orario di inizio
  const sortTasks = () => {
    const tasks = Array.from(taskList.getElementsByClassName('task-item'));

    tasks.sort((a, b) => {
      const startTimeA = a.querySelector('.task-time').textContent.split(' - ')[0];
      const startTimeB = b.querySelector('.task-time').textContent.split(' - ')[0];

      const [aHour, aMinute] = startTimeA.split(':').map(num => parseInt(num));
      const [bHour, bMinute] = startTimeB.split(':').map(num => parseInt(num));

      return aHour !== bHour ? aHour - bHour : aMinute - bMinute;
    });

    tasks.forEach(task => taskList.appendChild(task));  // Riordina gli elementi nel DOM
  };

  // Gestisci l'invio del form
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value;
    const startTime = taskStartTime.value;
    const endTime = taskEndTime.value;

    // Verifica che i campi siano stati riempiti
    if (text && startTime && endTime) {
      addTaskToDOM(text, startTime, endTime);
      saveTask(text, startTime, endTime);
      taskInput.value = '';
      taskStartTime.value = '';
      taskEndTime.value = '';
    } else {
      alert('Please fill in all fields!');
    }
  });

  // Carica le task all'inizio
  loadTasks();
});
