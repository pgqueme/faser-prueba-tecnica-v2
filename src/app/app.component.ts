import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { EditTaskDialogComponent } from './components/edit-task-dialog/edit-task-dialog.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AddTaskDialogComponent, EditTaskDialogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Control de Tareas';
  tasks: Task[] = [];

  showAddDialog = false;
  showEditDialog = false;
  editingTask: Task | null = null;

  addTask() {
    this.showAddDialog = true;
  }

  onTaskAdded(newTask: Task) {
    this.tasks.push(newTask);
    this.showAddDialog = false;
  }

  onDialogClosed() {
    this.showAddDialog = false;
  }

  openEditDialog(task: Task) {
    // clonar por si el usuario cancela
    this.editingTask = { ...task };
    this.showEditDialog = true;
  }

  onTaskUpdated(updated: Task) {
    this.tasks = this.tasks.map(t => (t.id === updated.id ? updated : t));
    this.closeEditDialog();
  }

  onTaskDeleted(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.closeEditDialog();
  }

  closeEditDialog() {
    this.showEditDialog = false;
    this.editingTask = null;
  }
}
