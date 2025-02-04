document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskStartTime = document.getElementById('task-start');
    const taskEndTime = document.getElementById('task-end');
    const taskList = document.getElementById('task-list');
  
    const loadTasks = () => {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => addTaskToDOM(task.text, task.startTime, task.endTime));
    };
  
    const saveTask = (text, startTime, endTime) => {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push({ text, startTime, endTime });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };
  
    const removeTaskFromStorage = (text) => {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const updatedTasks = tasks.filter(task => task.text !== text);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };
  
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
      editButton.className = 'edit-button';
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
      deleteButton.className = 'delete-button';
      deleteButton.addEventListener('click', () => {
        taskList.removeChild(li);
        removeTaskFromStorage(text);
      });
  
      li.appendChild(taskText);
      li.appendChild(taskTimeElement);
      li.appendChild(editButton);
      li.appendChild(deleteButton);
  
      taskList.appendChild(li);
  
      sortTasks();
      document.getElementById('task-input').focus();
    };
  
    const sortTasks = () => {
      const tasks = Array.from(taskList.getElementsByClassName('task-item'));
  
      tasks.sort((a, b) => {
        const startTimeA = a.querySelector('.task-time').textContent.split(' - ')[0];
        const startTimeB = b.querySelector('.task-time').textContent.split(' - ')[0];
  
        const [aHour, aMinute] = startTimeA.split(':').map(num => parseInt(num));
        const [bHour, bMinute] = startTimeB.split(':').map(num => parseInt(num));
  
        return aHour !== bHour ? aHour - bHour : aMinute - bMinute;
      });
  
      tasks.forEach(task => taskList.appendChild(task));
    };
  
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = taskInput.value;
      const startTime = taskStartTime.value;
      const endTime = taskEndTime.value;
  
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
  
    loadTasks();
});
