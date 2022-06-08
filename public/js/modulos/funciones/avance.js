import Swal from "sweetalert2";

export const calcularAvances = () => {
    //Seleccionamos las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length) {
        
        //Seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo')


        //calcular el avance
        const avance = Math.round((tareasCompletas.length  / tareas.length) * 100)

        //mostrar el avance
        const barra = document.querySelector('#porcentaje')

        barra.style.width = avance+'%'

        if(avance == 100){
            Swal.fire(
                'Project Completed',
                'projects is already done, you now can get some vacations... enjoy!',
                'success'
            )
        }

    }

    // console.log('Todos los avances ' , tareas)
    // alert(tareas)
}