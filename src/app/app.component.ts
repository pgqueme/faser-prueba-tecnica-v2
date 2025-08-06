import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { EditTaskDialogComponent } from './components/edit-task-dialog/edit-task-dialog.component';
import { BulkUploadDialogComponent } from './components/bulk-upload-dialog/bulk-upload-dialog.component';
import { Task } from './models/task.model';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

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
  title = 'Control de Tareas - Luis Franco';
  tasks: Task[] = [];

  showAddDialog = false;
  showEditDialog = false;
  showBulkDialog = false;
  editingTask: Task | null = null;

  loadingFromServer = false;

  constructor(private http: HttpClient) {}

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

  fetchFromServer() {
    if (this.loadingFromServer) return;
    this.loadingFromServer = true;

    this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').subscribe({
      next: data => {
        const randomFive = this.shuffleArray(data).slice(0, 5);
        const toAdd: Task[] = randomFive.map(item => ({
          id: Date.now() + Math.floor(Math.random() * 1000),
          title: item.title ?? 'Sin título',
          duration: typeof item.userId === 'number' && item.userId > 0 ? item.userId : 10,
        }));
        this.tasks.push(...toAdd);
        this.loadingFromServer = false;
      },
      error: err => {
        console.error('Error al obtener tareas del servidor', err);
        this.loadingFromServer = false;
      }
    });
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
