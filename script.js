// Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterSelect = document.getElementById('filter-tasks');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';
  const filter = filterSelect.value;

  const filtered = todos.filter(todo => {
    if (filter === 'checked') return todo.checked;
    if (filter === 'unchecked') return !todo.checked;
    return true; // all
  });

  if (filtered.length === 0) {
    todoList.innerHTML = `<li style="text-align:center; color:#888; padding:15px;">No tasks</li>`;
    return;
  }

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.checked ? 'checked' : '';
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.checked;
    checkbox.addEventListener('change', () => {
      todo.checked = checkbox.checked;
      saveToLocalStorage();
      renderTodos();
    });

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = todo.text;

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = todo.text;
    editInput.style.display = 'none';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.style.display = 'none';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';

    editBtn.addEventListener('click', () => {
      li.classList.add('editing');
      textSpan.style.display = 'none';
      editInput.style.display = 'block';
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
      editInput.focus();
    });

    saveBtn.addEventListener('click', () => {
      const newText = editInput.value.trim();
      if (newText) {
        todo.text = newText;
        saveToLocalStorage();
        renderTodos();
      }
    });

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveBtn.click();
      }
    });

    deleteBtn.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveToLocalStorage();
      renderTodos();
    });

    li.append(checkbox, textSpan, editInput, editBtn, saveBtn, deleteBtn);
    todoList.appendChild(li);
  });
}

// Add Task
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    checked: false
  };

  todos.push(newTodo);
  saveToLocalStorage();
  todoInput.value = '';
  renderTodos();
});

// Filter dropdown
filterSelect.addEventListener('change', renderTodos);

// Initial render
renderTodos();
