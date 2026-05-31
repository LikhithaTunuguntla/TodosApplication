let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

// 🔹 Helper: Load from localStorage
function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

// 🔹 Helper: Save to localStorage
function saveTodoList() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

// Manual save button (optional)
saveTodoButton.onclick = function() {
    saveTodoList();
};

// 🔹 Add new todo
function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value.trim(); // prevent spaces-only

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    saveTodoList(); // auto-save after adding
    userInputElement.value = "";
}

addTodoButton.onclick = function() {
    onAddTodo();
};

// 🔹 Toggle checkbox
function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");

    let todoObjectIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        return eachTodoId === todoId;
    });

    let todoObject = todoList[todoObjectIndex];
    todoObject.isChecked = !todoObject.isChecked;

    saveTodoList(); // auto-save after status change
}

// 🔹 Delete todo
function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let deleteElementIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        return eachTodoId === todoId;
    });
    todoList.splice(deleteElementIndex, 1);

    saveTodoList(); // auto-save after delete
}

// 🔹 Create and append todo item
function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.onclick = function () {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };
    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ml-2");
    deleteButton.style.marginLeft = "10px";
    deleteButton.onclick = function () {
        onDeleteTodo(todoId);
    };
    deleteIconContainer.appendChild(deleteButton);
}

// 🔹 Load existing todos on page load
for (let todo of todoList) {
    createAndAppendTodo(todo);
}
