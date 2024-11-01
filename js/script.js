let task_name = document.getElementById('task_name');
let task_date = document.getElementById('taskdate');
let form = document.getElementById('form');
let task_desc = document.getElementById('task_desc');
let task_p = document.getElementById('taskPriority');
let warning_container = document.getElementById('warning-container');
let warning_msg = document.getElementById('result');
let cards_container = document.getElementById('show-cards');
warning_container.style.display = "none";
let drag = null;
let editTaskId = null; // To store the task ID being edited

let task_array = [];
let id = 0;


form.addEventListener('submit',function (e){
    e.preventDefault();
    if (task_name.value !== "" && task_date.value !== "" && task_desc.value !== "" && task_p.value !== ""){
        push_to_array(task_name,task_date,task_desc,task_p);
        push_into_html(task_array);
        push_to_ls(task_array);
        clear();
    }else{
        warning_container.style.display = "block";
        warning_msg.innerHTML = "there are some empty fields!"
    }
})

// create an array 
function push_to_array(task_name,task_date,task_desc,task_p){
    let array= {
        id : ++id,
        title:task_name.value,
        date:task_date.value,
        desc:task_desc.value,
        priorite:task_p.value
    };
    task_array.push(array);
}
function push_to_ls(task_array) {
    window.localStorage.setItem("alltasks", JSON.stringify(task_array));
}
function get_from_ls() {
    let data = localStorage.getItem("alltasks");
    if (data) {
        task_array = JSON.parse(data);
        id = task_array.length
        push_into_html(task_array); 
    }
}
get_from_ls();
// clear the inputs
function clear(){
    task_name.value = "";
    task_date.value = "";
    task_desc.value = "";
    task_p.value = "";
}
// push the element into the html 
function push_into_html(task){
    cards_container.innerHTML = ""; 
    task.forEach(task => {
    let temp_div = document.createElement('div');
    temp_div.className = 'task-card w-full ';
    temp_div.setAttribute("data-id",`${task.id}`);

    temp_div.setAttribute("draggable","true")
    temp_div.innerHTML = `
        <div class="self-start p-4 rounded-md space-y-2 ${task.priorite === "p1" ? 'bg-red-500' : task.priorite === "p2" ? 'bg-green-500' : 'bg-yellow-500' }">
            <div class="header flex justify-between space-x-2 font-extrabold text-xl">
                <p>${task.id} - ${task.title}</p>
                <div class="text-sm space-x-1 cursor-pointer font-thin">
                    <i onclick="show_edit_model(${task.id})" class="edit-icon fa-regular fa-pen-to-square"></i>
                    <i class="fa-solid fa-xmark delete-icon"></i>
                </div>
            </div>
            <hr>
            <div class="content text-sm">
                <p>${task.desc}</p>
            </div>
            <div class="footer">
                <small class="bg-black px-2 py-1 rounded-full text-xs">${task.date}</small>
            </div>
        </div>`;
        cards_container.appendChild(temp_div);
        temp_div.querySelector('.delete-icon').addEventListener('click', function(){
            del_local(temp_div.getAttribute("data-id"));
            temp_div.remove();
        })
    });
    dragitem()
}

function del_local(taskId) {
    task_array = task_array.filter((task) => task.id != taskId);
    push_to_ls(task_array); // Update local storage after deletion
}
var index;
function show_edit_model(id) {
    document.getElementById('edit-modal').style.display ="flex"
    for ( let i = 0 ; i < task_array.length ; i++ ){
        if ( id == task_array[i].id){
            index = i;
        }
    }
    document.getElementById("taskedit").value = task_array[index].title;
    document.getElementById("edit_task_date").value = task_array[index].date;
    document.getElementById("edit_task_desc").value = task_array[index].desc;
    document.getElementById("edit_task_priority").value = task_array[index].priorite;
   
}
document.getElementById('edit-form').addEventListener('submit',function(){
    let array= {
        id : ++id,
        title:document.getElementById("taskedit").value,
        date:document.getElementById("edit_task_date").value,
        desc:document.getElementById("edit_task_desc").value,
        priorite:document.getElementById("edit_task_priority").value
    };
    task_array[index] = array
    push_to_ls(task_array)
    push_into_html(task_array);
})
function close_modal(){
    document.getElementById('edit-modal').style.display ="none"
}
function dragitem(){
    let items = document.querySelectorAll('.task-card');
    items.forEach(item => {
        item.addEventListener('dragstart', function(){
            drag = item;
            item.style.opacity = "0.5";
        })
        item.addEventListener('dragend', function(){
            drag = null;
            item.style.opacity = "";
        });
        document.querySelectorAll('.box').forEach(box => {
            box.addEventListener('dragover', function(e){
                e.preventDefault()
               
            })
            box.addEventListener("dragleave", function () {
                
            })
            box.addEventListener('drop', function () {
                box.append(drag)
            })
        });
    })
}