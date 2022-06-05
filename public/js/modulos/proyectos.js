import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){

    btnEliminar.addEventListener('click' , (e) => {

        const urlProyecto = e.target.dataset.proyectoUrl

        //console.log('Diste click en Eliminar', e.target.dataset);

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
              const url = `${location.origin}/proyecto/${urlProyecto}`;

              console.log('Url de confirmacion: ', url);

              axios.delete(url, {params: {urlProyecto} })
              .then(function(resp) {
                //Success delete response
                console.log('Respuesta del servidor [Delete] : ' , resp)

                Swal.fire(
                  'Deleted!',
                  'Your Project has been deleted.',
                  'success'
                )

                  setTimeout(() => {
                    window.location.replace(location.origin)
                  }, 2000)

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
    })
}

export  default btnEliminar;
