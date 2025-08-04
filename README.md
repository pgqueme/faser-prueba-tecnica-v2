# Prueba técnica Estudio Faser

## Descripción
Dentro de este repositorio encontrarás una aplicación sencilla que lleva una tabla con manejo de tareas. Deberás modificar el código en tu propia rama para cumplir con los requerimientos descritos a continuación.

En esta prueba evaluaremos:
- Conocimiento de la estructura de Angular.
- Comprensión de instrucciones.
- Uso de herramientas de IA.
- Formato y buenas prácticas de uso de Git.

**Importante:** Esta prueba está pensada para realizarse dos horas o menos. Para poder cumplir con este tiempo, es necesario usar herramientas de inteligencia artificial como Cursor, Claude Code, ChatGPT, Copilot u otros. Valerse de estas herramientas para poder completar las tareas dentro del tiempo sugerido.

## Instrucciones
### Instalación
Utilizando Node versión 20 o superior, instala las librerías de este proyecto usando npm.

Por cada instrucción descrita a continuación, hacer un commit. Dentro del código agregar documentación interna que explique claramente lo que el código hace en las partes que necesiten explicación.

### Primer commit
Realiza un primer commit colocando tu nombre junto al título de "Control de Tareas", por ejemplo: "Control de Tareas - Juan Pérez".

### Agregar dialog para editar tareas
Actualmente se agregan tareas mediante un dialog que se habilita al hacer clic en "Agregar tarea". Al agregar la tarea, esta aparecen en la tabla, con un botón para poder Eliminar, sin opción a editar. 

Modificaremos el funcionamiento actual para que en lugar de mostrar la columna de Eliminar, se pueda hacer clic sobre la fila de la tarea para que esto abra un dialog o popup donde se puedan editar los datos de la misma, así como poder eliminarla desde el mismo dialog.

### Carga masiva de tareas
Agregar un botón junto al de Agregar tarea, llamado "Carga masiva". Esto abrirá un dialog con un campo de texto grande, donde se podrán colocar múltiples líneas de texto. Cada línea de texto ingresada se deberá convertir en una tarea. Cada línea deberá contener el separador pipe "|" al final del texto, con un número el cual se convertirá en la duración de la tarea. Si no se incluye un número o separador en la línea, asignar la duración por defecto de 10 minutos.

La estructura del texto será como esta, lo cual se traduciría en 4 tareas insertadas a la tabla:
```
Primera tarea|4
Segunda tarea de mayor duración|15
Tercera tarea sin duración
Cuarta tarea|6
```

### Conectar con API REST
Agrega un botón junto al de carga masiva y agregar tarea llamado "Obtener de servidor". Este desencadenará un proceso que consulte el siguiente endpoint mediante un HTTP GET Request:

`https://jsonplaceholder.typicode.com/todos`

Este devuelve un JSON con 200 tareas. Se deberán tomar 5 tareas aleatorias del listado y agregarlas a la tabla de tareas. Usar la propiedad `title` para el título, y la propiedad `userId` como la duración de la tarea.

### Finalización
Al finalizar la prueba, dejar publicados todos los cambios realizados y enviar un correo a la persona con la que ha realizado el proceso de reclutamiento para notificar la finalización.
