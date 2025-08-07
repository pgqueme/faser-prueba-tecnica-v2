import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { EditTaskDialogComponent } from './components/edit-task-dialog/edit-task-dialog.component';
import { Task } from './models/task.model';
import { BulkTaskDialogComponent } from './components/bulk-task-dialog.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AddTaskDialogComponent, EditTaskDialogComponent, BulkTaskDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Control de Tareas - Jorge Estuardo Pumay Soy';
  tasks: Task[] = [];
  showDialog = false;
  taskToEdit: Task | null = null; //tarea seleccionada para editar
  showBulkDialog = false;

  addTask() {
    this.showDialog = true;
  }

  onTaskAdded(newTask: Task) {
    this.tasks.push(newTask);
    this.showDialog = false;
  }

  onDialogClosed() {
    this.showDialog = false;
  }

  // Abrir el diálogo de edición con una copia de la tarea
  editTask(task: Task) {
    this.taskToEdit = { ...task }; 
  }

  onTaskUpdated(updatedTask: Task) {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
    this.taskToEdit = null;
  }

  onTaskDeleted(taskToDelete: Task) {
    this.tasks = this.tasks.filter(t => t.id !== taskToDelete.id);
    this.taskToEdit = null;
  }

  onEditDialogClosed() {
    this.taskToEdit = null;
  }

  //metodo para abrir el diálogo de carga masiva
  openBulkDialog() {
    this.showBulkDialog = true;
  }

  onBulkDialogClosed() {
    this.showBulkDialog = false;
  }

  onBulkTasksAdded(tasks: { title: string; duration: number }[]) {
    for (const task of tasks) {
      this.tasks.push({
        id: Date.now() + Math.floor(Math.random() * 1000), // genera un ID único
        title: task.title,
        duration: task.duration
      });
    }
    this.showBulkDialog = false;
  }
}
