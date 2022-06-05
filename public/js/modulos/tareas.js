import axios from "axios";

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    
    
    tareas.addEventListener('click' , e => {
        // console.log('[moduleTareas] >>> ', e.target.classList);


        //Actualizar el estado de una tarea
        if(e.target.classList.contains('fa-check-circle')){
            // console.log('Actualizando...')
            const icono = e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea
            console.log('dataset : ' , idTarea)

            //Hacer request para actualizar una tarea
            const url = `${location.origin}/tarea/${idTarea}`;

            axios.patch(url, {idTarea})
            .then((res) => {
                console.log('Actualizar tarea resp >>> ', res)
            })
            .catch((err) => {

            })
        }

    })


}else{
    console.log('No se encontraron tareas')
}

export default tareas;