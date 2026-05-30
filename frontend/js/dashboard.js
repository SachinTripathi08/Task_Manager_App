var currentUser = null;

// Check if user is logged in
async function checkAuth() {
    try {
        var data = await apiCall('/auth/me');
        currentUser = data.username;
        document.getElementById('welcome-msg').textContent = 'Welcome, ' + currentUser;
    } catch (error) {
        window.location.href = 'index.html';
    }
}

// Load all tasks and render them
async function loadTasks() {
    var todoList = document.getElementById('todo-list');
    var inprogressList = document.getElementById('inprogress-list');
    var doneList = document.getElementById('done-list');

    // Show loading
    todoList.innerHTML = '<div class="loading">Loading tasks</div>';
    inprogressList.innerHTML = '';
    doneList.innerHTML = '';

    try {
        var tasks = await apiCall('/tasks');

        // Clear lists
        todoList.innerHTML = '';
        inprogressList.innerHTML = '';
        doneList.innerHTML = '';

        var todoCount = 0;
        var inprogressCount = 0;
        var doneCount = 0;

        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            var card = createTaskCard(task);

            if (task.status === 'TODO') {
                todoList.appendChild(card);
                todoCount++;
            } else if (task.status === 'IN_PROGRESS') {
                inprogressList.appendChild(card);
                inprogressCount++;
            } else if (task.status === 'DONE') {
                doneList.appendChild(card);
                doneCount++;
            }
        }

        // Update counts
        document.getElementById('todo-count').textContent = todoCount;
        document.getElementById('inprogress-count').textContent = inprogressCount;
        document.getElementById('done-count').textContent = doneCount;

        // Show empty messages
        if (todoCount === 0) todoList.innerHTML = '<p style="color:#999;font-size:13px;text-align:center;">No tasks</p>';
        if (inprogressCount === 0) inprogressList.innerHTML = '<p style="color:#999;font-size:13px;text-align:center;">No tasks</p>';
        if (doneCount === 0) doneList.innerHTML = '<p style="color:#999;font-size:13px;text-align:center;">No tasks</p>';

    } catch (error) {
        todoList.innerHTML = '<p class="error-message" style="display:block;">Failed to load tasks: ' + error.message + '</p>';
    }
}

// Create a task card element
function createTaskCard(task) {
    var card = document.createElement('div');
    card.className = 'task-card';

    var title = document.createElement('h3');
    title.textContent = task.title;
    card.appendChild(title);

    if (task.description) {
        var desc = document.createElement('p');
        desc.textContent = task.description;
        card.appendChild(desc);
    }

    var actions = document.createElement('div');
    actions.className = 'task-card-actions';

    // Status dropdown
    var select = document.createElement('select');
    var statuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    for (var i = 0; i < statuses.length; i++) {
        var option = document.createElement('option');
        option.value = statuses[i];
        option.textContent = statuses[i] === 'IN_PROGRESS' ? 'In Progress' : statuses[i] === 'TODO' ? 'Todo' : 'Done';
        if (statuses[i] === task.status) {
            option.selected = true;
        }
        select.appendChild(option);
    }
    select.addEventListener('change', function () {
        updateTaskStatus(task.id, this.value, task.title, task.description);
    });
    actions.appendChild(select);

    // Edit button
    var editBtn = document.createElement('button');
    editBtn.className = 'btn btn-small';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function () {
        editTask(task);
    });
    actions.appendChild(editBtn);

    // Delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-small btn-danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function () {
        deleteTask(task.id, task.title);
    });
    actions.appendChild(deleteBtn);

    card.appendChild(actions);
    return card;
}

// Add a new task
async function addTask() {
    var titleInput = document.getElementById('task-title');
    var descInput = document.getElementById('task-desc');
    var title = titleInput.value.trim();
    var description = descInput.value.trim();

    if (!title) {
        showDashboardError('Please enter a task title');
        return;
    }

    try {
        await apiCall('/tasks', 'POST', {
            title: title,
            description: description
        });
        titleInput.value = '';
        descInput.value = '';
        hideDashboardError();
        loadTasks();
    } catch (error) {
        showDashboardError('Failed to add task: ' + error.message);
    }
}

// Update task status
async function updateTaskStatus(taskId, newStatus, title, description) {
    try {
        await apiCall('/tasks/' + taskId, 'PUT', {
            title: title,
            description: description,
            status: newStatus
        });
        loadTasks();
    } catch (error) {
        showDashboardError('Failed to update task: ' + error.message);
    }
}

// Edit a task using prompt
function editTask(task) {
    var newTitle = prompt('Edit task title:', task.title);
    if (newTitle === null) return; // cancelled
    newTitle = newTitle.trim();
    if (!newTitle) {
        alert('Title cannot be empty');
        return;
    }

    var newDesc = prompt('Edit task description:', task.description || '');
    if (newDesc === null) return; // cancelled

    apiCall('/tasks/' + task.id, 'PUT', {
        title: newTitle,
        description: newDesc,
        status: task.status
    }).then(function () {
        loadTasks();
    }).catch(function (error) {
        showDashboardError('Failed to update task: ' + error.message);
    });
}

// Delete a task
async function deleteTask(taskId, taskTitle) {
    var confirmed = confirm('Are you sure you want to delete "' + taskTitle + '"?');
    if (!confirmed) return;

    try {
        await apiCall('/tasks/' + taskId, 'DELETE');
        loadTasks();
    } catch (error) {
        showDashboardError('Failed to delete task: ' + error.message);
    }
}

// Logout
async function logout() {
    try {
        await apiCall('/auth/logout', 'POST');
    } catch (error) {
        // Ignore errors on logout
    }
    window.location.href = 'index.html';
}

// Show error on dashboard
function showDashboardError(message) {
    var errorDiv = document.getElementById('dashboard-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Hide error
function hideDashboardError() {
    var errorDiv = document.getElementById('dashboard-error');
    errorDiv.style.display = 'none';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async function () {
    await checkAuth();
    loadTasks();

    // Add task form
    document.getElementById('add-task-btn').addEventListener('click', addTask);

    // Allow Enter key on title input to add task
    document.getElementById('task-title').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', logout);
});
