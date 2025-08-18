import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { BulkImportDialogComponent } from './components/bulk-import-dialog/bulk-import-dialog.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HttpClientModule, AddTaskDialogComponent, BulkImportDialogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // <- plural
  
})
export class AppComponent implements OnInit {
  private isBrowser = true;
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

showBulkDialog = false;

openBulk(){ this.showBulkDialog = true; }
onBulkClosed(){ this.showBulkDialog = false; }



ngOnInit(): void {
  this.load();
}

onTasksImported(newTasks: Task[]){
  this.tasks = [...this.tasks, ...newTasks];
  this.selectedTask = newTasks[newTasks.length - 1] ?? this.selectedTask;
  this.save();
  this.showBulkDialog = false;
}


fetchFromServer(){
  this.http.get<any[]>('https://jsonplaceholder.typicode.com/todos')
    .subscribe({
      next: (all) => {
        const picked = [...all].sort(() => 0.5 - Math.random()).slice(0, 5);
        const base = Date.now();
        const imported: Task[] = picked.map((t, i) => ({
          id: base + i,
          title: String(t?.title ?? 'Tarea remota'),
          duration: Number(t?.userId ?? 10) || 10
        }));
        this.tasks = [...this.tasks, ...imported];
        this.selectedTask = imported[imported.length - 1] ?? this.selectedTask;
        this.save?.();
      },
      error: (e) => console.error('Error obteniendo tareas', e)
    });
}



clearAll() {  //para borrar todas las tareas si es necesario
  if (!this.tasks.length) return;
  const ok = confirm('¿Eliminar todas las tareas? Esta acción no se puede deshacer.');
  if (!ok) return;

  this.tasks = [];
  this.selectedTask = null;
  this.showDialog = false;
  this.save();
}


// Seguras con SSR save y load
private save(): void {
  if (!this.isBrowser) return;
  localStorage.setItem('tasks', JSON.stringify(this.tasks));
}

private load(): void {
  if (!this.isBrowser) { this.tasks = []; return; }
  try {
    const raw = localStorage.getItem('tasks');
    this.tasks = raw ? JSON.parse(raw) : [];
  } catch {
    this.tasks = [];
  }
}

  title = 'Control de Tareas - Pablo David Morales Martinez';
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
