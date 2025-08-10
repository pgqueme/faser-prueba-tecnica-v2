import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { BulkTaskDialogComponent } from './components/bulk-task-dialog/bulk-task-dialog.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AddTaskDialogComponent, BulkTaskDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /**
   * Maneja el evento de tareas agregadas por carga masiva.
   */
  onTasksBulkAdded(tasks: { title: string; duration: number }[]) {
    // Agrega cada tarea procesada al arreglo principal, generando un id único
    tasks.forEach(t => {
      this.tasks.push({
        id: Date.now() + Math.floor(Math.random() * 10000),
        title: t.title,
        duration: t.duration
      });
    });
    this.showBulkDialog = false;
  }
  /**
   * Estado para mostrar el diálogo de carga masiva de tareas.
   */
  showBulkDialog = false;
  /**
   * Abre el diálogo de carga masiva de tareas.
   */
  openBulkDialog() {
    this.showBulkDialog = true;
  }
  // Título principal de la aplicación, con mi nombre
  title = 'Control de Tareas - Sergio Quej';
  tasks: Task[] = [];
  showDialog = false;
  selectedTask: Task | null = null;
  /**
   * Tarea que se está editando actualmente. Si es null, el diálogo está en modo agregar.
   */
  taskToEdit: Task | null = null;

  /**
   * Abre el diálogo en modo agregar nueva tarea.
   */
  addTask() {
    this.taskToEdit = null;
    this.showDialog = true;
  }

  /**
   * Maneja el evento de agregar una nueva tarea.
   */
  onTaskAdded(newTask: Task) {
    this.tasks.push(newTask);
    this.showDialog = false;
  }

  /**
   * Maneja el evento de edición de una tarea existente.
   */
  onTaskEdited(editedTask: Task) {
    this.tasks = this.tasks.map(task => task.id === editedTask.id ? editedTask : task);
    this.showDialog = false;
    this.selectedTask = null;
  }

  /**
   * Maneja el evento de eliminación de una tarea existente.
   */
  onTaskDeleted(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.showDialog = false;
    this.selectedTask = null;
  }

  /**
   * Maneja el cierre del diálogo, sin cambios.
   */
  onDialogClosed() {
    this.showDialog = false;
    this.taskToEdit = null;
  }

  /**
   * Al hacer clic en una fila, abre el diálogo en modo edición para esa tarea.
   */
  selectTask(task: Task) {
    this.selectedTask = task;
    this.taskToEdit = task;
    this.showDialog = true;
  }

  // La eliminación ahora se realiza desde el diálogo de edición

  /**
   * Indica si la tarea está seleccionada (para estilos en la tabla).
   */
  isTaskSelected(task: Task): boolean {
    return this.selectedTask?.id === task.id;
  }
}
