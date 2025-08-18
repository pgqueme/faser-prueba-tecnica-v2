import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AddTaskDialogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // <- plural
  
})
export class AppComponent implements OnInit {
ngOnInit(): void {
  this.load();
}

private save(): void {
  localStorage.setItem('tasks', JSON.stringify(this.tasks));
}

private load(): void {
  const raw = localStorage.getItem('tasks');
  this.tasks = raw ? JSON.parse(raw) : [];
}

  title = 'Control de Tareas';
  tasks: Task[] = [];
  showDialog = false;
  selectedTask: Task | null = null;

  // null => alta; abre el diálogo en modo "Agregar"
  addTask() {
    this.selectedTask = null;
    this.showDialog = true;
  }

// añadir usando inmutabilidad, sincronizar panel y persistir
  onTaskAdded(newTask: Task) {
    this.tasks = [...this.tasks, newTask];
    this.selectedTask = newTask;
    this.save();
    this.showDialog = false;
  }

  // objeto => edición; abre el diálogo con la tarea seleccionada
  onRowClick(task: Task) {
    this.selectedTask = task;
    this.showDialog = true;
}


  onDialogClosed() {
    this.showDialog = false;
  }

/*  selectTask(task: Task) {
    this.selectedTask = task;
  }

  deleteTask() {
    if (this.selectedTask) {
      this.tasks = this.tasks.filter(task => task.id !== this.selectedTask!.id);
      this.selectedTask = null;
    }
  } */

  isTaskSelected(task: Task): boolean {
    return this.selectedTask?.id === task.id;
  }

  // guardar cambios de edición
  onTaskUpdated(updated: Task) {
    this.tasks = this.tasks.map(t => t.id === updated.id ? updated : t);
    this.selectedTask = updated;
    this.save();
    this.showDialog = false;
}

// eliminar desde el diálogo + limpiar selección si corresponde + persistir
  onTaskDeleted(deleted: Task) {
    this.tasks = this.tasks.filter(t => t.id !== deleted.id);
    if (this.selectedTask?.id === deleted.id) this.selectedTask = null;
    this.save();
    this.showDialog = false;
}


}
