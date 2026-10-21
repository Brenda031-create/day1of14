var tasks = [];

function addTask(task){
    tasks.push(task);
}

function viewTasks(){
    return tasks;
}

function markTaskAsCompleted(index){
    if(index >= 0 && index < tasks.length){
        tasks[index].completed = true;
    }
}
 function updateTask(index, newTask){
    if(index >=0 && index < tasks.length){
        tasks[index] = newTask;
    }
 }
  function removeTask(index){
    if(index >= 0 && index < tasks.length){
        tasks.splice(index, 1);
    }
  }
  addTask({title: "Buy groceries", completed: false});
  addTask({title: "Clean the house", completed: false});
  addTask({title: "Finish the project", completed: false});

  var view = viewTasks();

  console.log(view);

  markTaskAsCompleted(1);
  console.log(view);

  updateTask(2, {title: "Dance a song", completed: true});

  view = viewTasks();
  console.log(view);

  removeTask(0);
  console.log(view);
  view = viewTasks();