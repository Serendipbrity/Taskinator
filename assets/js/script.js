var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");   
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check if input values are empty strings
    if (!taskNameInput  || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    var isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
    
    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do",
    };

    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
    console.log(taskDataObj);
    console.log(taskDataObj.status);
    }
};
    var createTaskEl = function(taskDataObj) {

     //create list item
     var listItemEl = document.createElement("li");
     listItemEl.className = "task-item";

     // add task id as a custom attribute
     listItemEl.setAttribute("data-task-id", taskIdCounter);
 
     // create div to hold task info and add to list item
     var taskInfoEl = document.createElement("div");
     // add class name to div
     taskInfoEl.className = "task-info";
     // add HTML content to div
     taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
     // add div to li
     listItemEl.appendChild(taskInfoEl);
     
     

     var taskActionsEl = createTaskActions(taskIdCounter);
     listItemEl.appendChild(taskActionsEl);

     taskDataObj.id = taskIdCounter;

     tasks.push(taskDataObj);
     // add entire list item to list
     //tasksToDoEl.appendChild(listItemEl);
     saveTasks();
     //increase task counter for next unique id
     taskIdCounter++;
    };

    var createTaskActions = function(taskId) {
        var actionContainerEl = document.createElement("div");
        actionContainerEl.className = "task-actions";

        //create edit button
        var editButtonEl = document.createElement("button");
        editButtonEl.textContent = "Edit";
        editButtonEl.className = "btn edit-btn";
        editButtonEl.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(editButtonEl);

        //create delete button
        var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        deleteButtonEl.className = "btn delete-btn";
        deleteButtonEl.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(deleteButtonEl);

        var statusSelectEl = document.createElement("select");
        statusSelectEl.setAttribute("name", "status-change");
        statusSelectEl.setAttribute("data-task-id", taskId);
        statusSelectEl.className = "select-status";
        actionContainerEl.appendChild(statusSelectEl);

        var statusChoices = ["To Do", "In Progress", "Completed"];
          for (var i = 0; i < statusChoices.length; i++) {
              // create option element
              var statusOptionEl = document.createElement("option");
              statusOptionEl.setAttribute("value", statusChoices[i]);
              statusOptionEl.textContent = statusChoices[i];

              statusSelectEl.appendChild(statusOptionEl);
          }
        return actionContainerEl;
    };

var completeEditTask = function(taskName, taskType, taskId) {
    // find task list item with taskId value
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    formEl.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
};


var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
      console.log("edit", targetEl);
      var taskId = targetEl.getAttribute("data-task-id");
      editTask(taskId);
  }
  // delete button was clicked
   else if (targetEl.matches(".delete-btn")) {
       console.log("delete", targetEl);
      //get the elements task id
      var taskId = targetEl.getAttribute("data-task-id");
      deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function(event) {
console.log(event.target.value);

    // get the tasks items id
    var taskId = event.target.getAttribute("data-task-id");

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get the currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
        } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
        } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
        }  
        
        for (var i = 0; i < tasks.length; i++){
            if (tasks[i].id === parseInt(taskId)) {
                tasks[i].status = statusValue;
            }
        }
        saveTasks();
    };

var editTask = function(taskId) {
    console.log(taskId);

    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); 
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    // write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    formEl.setAttribute("data-task-id", taskId);
    formEl.querySelector("#save-task").textContent = "Save Task";
}; 

var deleteTask = function(taskId) {
      console.log(taskId);
      // find task list element with taskId value to remove it
      var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
      
      taskSelected.remove();

      // create new array to hold updated list
      var updatedTaskArr = []; 

      //loop through current tasks
      for (var i = 0; i < tasks.length; i++) {
          //if tasks[i].id doesnt match the value of taskId, keep the task and push it to a new array
          if (tasks[i].id !== parseInt(taskId)) {
              updatedTaskArr.push(tasks[i]);
          }
      }
      // reassign tasks array to be the same as updatedTaskArr
      tasks = updatedTaskArr;
      saveTasks();
  };

// create a new task
formEl.addEventListener("submit", taskFormHandler); 
// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

  loadTasks();