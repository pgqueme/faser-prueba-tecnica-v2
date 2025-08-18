// + Soporte para recibir una tarea a editar y reaccionar a cambios (@Input)
import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-overlay" (click)="close()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>{{ isEdit ? 'Editar Tarea' : 'Agregar Nueva Tarea' }}</h2>
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Título:</label>
            <input 
              type="text" 
              id="title" 
              formControlName="title" 
              placeholder="Ingrese el título de la tarea"
              class="form-control"
            >
            <div class="error" *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
              El título es requerido
            </div>
          </div>
          
          <div class="form-group">
            <label for="duration">Duración (minutos):</label>
            <input 
              type="number" 
              id="duration" 
              formControlName="duration" 
              placeholder="Ingrese la duración en minutos"
              class="form-control"
              min="1"
            >
            <div class="error" *ngIf="taskForm.get('duration')?.invalid && taskForm.get('duration')?.touched">
              La duración debe ser un número mayor a 0
            </div>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="close()">Cancelar</button>
          <!-- Solo visible en modo edición -->
            <button *ngIf="isEdit" type="button" class="btn btn-danger" (click)="onDelete()">Eliminar</button>
          <!-- El texto cambia según el modo -->
            <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid">
              {{ isEdit ? 'Guardar' : 'Agregar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .dialog-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-width: 400px;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .dialog-actions {
      display: flex;
      justify-content:center; /* centrado horizontal */
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-danger{
      background-color:#dc3545;
      color:#fff;
    }
  
    .btn-danger:hover{
      background-color:#b02a37;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
// Doc: activamos hook para precargar el formulario cuando llega una tarea
export class AddTaskDialogComponent implements OnChanges {
  // MODO EDICIÓN: si llega una tarea, el diálogo cambia a "Editar"
  @Input() task: Task | null = null;
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() dialogClosed = new EventEmitter<void>();
  // Eventos específicos para edición/eliminación
  @Output() taskUpdated = new EventEmitter<Task>();   // cuando se guarda una edición
  @Output() taskDeleted = new EventEmitter<Task>();   // cuando se elimina desde el diálogo
  
  taskForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      // Doc: en alta proponemos 10 min por defecto
      duration: [10, [Validators.required, Validators.min(1)]]
    });
  }

  // Indica si el diálogo está en modo edición (llega una tarea vía @Input)
  get isEdit(): boolean {
    return !!this.task;
  }

  // Cuando cambie el @Input task, precargamos el formulario con sus datos
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']?.currentValue) {
      this.taskForm.setValue({
        title: this.task!.title,
        duration: this.task!.duration
      });
    }
  }

// en edición emitimos taskUpdated; en alta emitimos taskAdded
  onSubmit() {
  if (this.taskForm.valid) {
    const { title, duration } = this.taskForm.value;

    if (this.isEdit) {
      const updated: Task = { ...this.task!, title, duration };
      this.taskUpdated.emit(updated);
    } else {
      const newTask: Task = { id: Date.now(), title, duration };
      this.taskAdded.emit(newTask);
    }

    this.close();
  }
}

// elimina la tarea actual (solo en modo edición)
onDelete() {
  if (this.isEdit && this.task) {
    this.taskDeleted.emit(this.task);
    this.close();
  }
}

  
  close() {
    this.dialogClosed.emit();
  }
} 