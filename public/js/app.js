import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import {calcularAvances} from './modulos/funciones/avance';

document.addEventListener('DOMContentLoaded' , () => {
    calcularAvances();
})

