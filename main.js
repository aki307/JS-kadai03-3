const taskSubmit = document.getElementById('submit-button');
const taskTable = document.getElementById('task-table');
const taskName = document.getElementById('task-name');
let displayTasksHTML = '';
let tasks = [];


taskSubmit.addEventListener('click', function(event) {
  event.preventDefault();
  const newTask = taskName.value;
  tasks.push({
    id: Object.keys(tasks).length,
    taskName: newTask,
    taskStatus: 'working',
  });
  displayTasksHTML = '';
  displayTasksHTML += `
        <th>${tasks.length}</th>
        <th>${newTask}</th>
        <th> 
          <button type="button" class="working-button working-state${tasks.length}">作業中</button>
          <button type="button" class="delete-button delete-execution${tasks.length}">削除</button>
        </th>
      `;

  const newRow = document.createElement("tr");
  newRow.innerHTML = displayTasksHTML;

  const taskTableBody = taskTable.querySelector("tbody");
  if (!taskTableBody) {
    const taskTableBody = document.createElement("tbody");
    taskTableBody.appendChild(newRow);
    taskTable.appendChild(taskTableBody);
  }
  else {
    taskTableBody.appendChild(newRow);
  }

});

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-button')) {
    const rowToRemove = event.target.closest('tr');
    if (rowToRemove) {
      const thElement = rowToRemove.querySelector('th');
      if (thElement) {
        const taskIndex = parseInt(thElement.textContent);
        let targetIndex = tasks.findIndex(task => task.id === taskIndex);
        if (targetIndex !== -1) {
          tasks.splice(targetIndex, 1);
        }
        rowToRemove.remove();

        updateTaskIDs(taskIndex);
        displayTasks();
      }
    }
  }
});


function updateTaskIDs(deletedIndex) {
  const taskRows = taskTable.querySelectorAll('tbody tr');
  taskRows.forEach((row, index) => {
    const thElement = row.querySelector('th:first-child');
    if (thElement) {
      const taskId = index + 1;
      thElement.textContent = taskId;
      tasks[index].id = taskId;
    }
  });
}

function displayTasks() {
  const displayTasksElement = document.getElementById('displayTasks');
  if (displayTasksElement) {
    displayTasksElement.textContent = JSON.stringify(tasks);
  }
}

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('working-button')) {
    const stateChange = event.target.closest('tr');
    if (stateChange) {
      const changeElement = stateChange.querySelector('th');
      if (changeElement) {
        const taskIndex = parseInt(changeElement.textContent);
        let targetIndex = tasks.findIndex(task => task.id === taskIndex);
        if (targetIndex !== -1) {
          tasks = tasks.map(obj => {
            if (obj.id === taskIndex) {
              if (obj.taskStatus === 'working') {
                return { ...obj, taskStatus: 'completed' };
              }
              else if (obj.taskStatus === 'completed') {
                return { ...obj, taskStatus: 'working' };
              }
            }
            return obj;
          });
          stateChangeRow(taskIndex);
        }
      }
    }
  }
});

function stateChangeRow(taskIndex, changeElement) {
  const taskRows = taskTable.querySelectorAll('tbody tr');
  taskRows.forEach((row, index) => {
    const thElement = row.querySelector('th:first-child');
    if (thElement) {
      const taskId = parseInt(thElement.textContent);
      if (taskId === taskIndex) {
        const changeRow = row.querySelector('th:nth-child(3) button.working-button');
        if (changeRow) {
          if (changeRow.textContent === '作業中') {
            changeRow.textContent = '完了';
          }
          else if (changeRow.textContent === '完了') {
            changeRow.textContent = '作業中';
          }
        }
      }
    }
  });
}
