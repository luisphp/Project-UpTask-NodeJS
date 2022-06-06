import Swal from "sweetalert2";
import axios from "axios";
import {calcularAvances} from '../modulos/funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
        
    tareas.addEventListener('click' , e => {
        // console.log('[moduleTareas] >>> ', e.target.classList);

        //Actualizar el estado de una tarea
        if(e.target.classList.contains('fa-check-circle')){
            // console.log('Actualizando...')
            const icono = e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea
            // console.log('dataset : ' , idTarea)

            //Hacer request para actualizar una tarea
            const url = `${location.origin}/tarea/${idTarea}`;

            axios.patch(url, {idTarea})
            .then((res) => {
                // console.log('[Front]  Actualizar tarea resp >>> ', res)

                if(res.status == 200){
                    icono.classList.toggle('completo')
                }
                calcularAvances()
            })
            .catch((err) => {
                console.log('No se pudo eliminar la tarea >>> ', err)
            })
        }


        //Eliminar una tarea
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement, idTarea = tareaHTML.dataset.tarea

            console.log('[Eliminar] ', tareaHTML.dataset)

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
    
                  // Enviar peticion a axios
                  const url = `${location.origin}/tarea/${idTarea}`;
    
                  axios.delete(url, { params: {idTarea} })
                  .then(function(resp) {
                    //Success delete response
                    console.log('Respuesta del servidor [Delete-Tarea] : ' , resp)
                    
                    tareaHTML.parentElement.removeChild(tareaHTML)

                    Swal.fire(
                      'Deleted!',
                      'Your Task has been deleted.',
                      'success'
                    )
    
                    calcularAvances()
    
                  }).catch((resp) => {
                    console.log('Error al eliminar el proyecto: ', resp )
    
                    Swal.fire(
                      'Not deleted!',
                      'Your Project has NOT been deleted: ' + resp,
                      'error'
                    )
                  })
                }
            })
            
        }

    })


}else{
    console.log('No se encontraron tareas')
}

export default tareas;