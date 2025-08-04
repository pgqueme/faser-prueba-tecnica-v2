import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { EditTaskDialogComponent } from './components/edit-task-dialog/edit-task-dialog.component';
import { BulkUploadDialogComponent } from './components/bulk-upload-dialog/bulk-upload-dialog.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AddTaskDialogComponent,
    EditTaskDialogComponent,
    BulkUploadDialogComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Control de Tareas';
  tasks: Task[] = [];

  showAddDialog = false;
  showEditDialog = false;
  showBulkDialog = false;
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
    this.showBulkDialog = false;
    this.showEditDialog = false;
  }

  openEditDialog(task: Task) {
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

  openBulkUploadDialog() {
    this.showBulkDialog = true;
  }

  onBulkTasksAdded(newTasks: Task[]) {
    this.tasks.push(...newTasks);
    this.showBulkDialog = false;
  }
}
