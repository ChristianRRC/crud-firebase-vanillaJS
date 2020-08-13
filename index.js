const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("task-container");

let editing =  false;
let id= '';

const saveTask = (title, description) => {
  db.collection("tasks").doc().set({
    title,
    description,
  });
};

const onGetTask = (callback) => db.collection("tasks").onSnapshot(callback);

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const getTask = (id) => db.collection('tasks').doc(id).get()

const updateTask = (id, datos) => db.collection("tasks").doc(id).update(datos);

window.addEventListener("DOMContentLoaded", async () => {
  await onGetTask((querySnapshot) => {
    taskForm.reset()
    taskContainer.innerHTML = "";
    querySnapshot.forEach(
      (doc) =>{
        const task = doc.data() 
        task.id = doc.id

        taskContainer.innerHTML += `<div class="card card-body border-primary">
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <div>
              <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
              <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
            </div>
          </div>`
      });

    const btnsDelete = document.querySelectorAll(".btn-delete");
    btnsDelete.forEach(btn=> btn.addEventListener("click", async () => {
       await deleteTask(btn.dataset.id)
    }));

const btnsEdit = document.querySelectorAll('.btn-edit');
btnsEdit.forEach(btn => {
  btn.addEventListener('click',async ()=>{
    taskForm['btn-task-form'].innerText = 'Update'
    const doc = await getTask(btn.dataset.id);
    editing = true;
    id = doc.id
    
    taskForm['task-title'].value = doc.data().title
    taskForm['task-description'].value = doc.data().description
    
  })
})

  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskForm["task-title"];
  const description = taskForm["task-description"];

  if(editing){
    await updateTask(id,{
      title: title.value,
      description: description.value
    })
    taskForm['btn-task-form'].innerText= 'Save'
    editing = false;
    id='';
  }else{
      await saveTask(title.value, description.value);
  }


  //taskForm.reset()
});
