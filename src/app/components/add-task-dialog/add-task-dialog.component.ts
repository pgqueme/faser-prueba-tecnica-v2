import { Component, EventEmitter, Output } from '@angular/core';
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
        <h2>Agregar Nueva Tarea</h2>
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
            <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid">Agregar</button>
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
      justify-content: flex-end;
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
export class AddTaskDialogComponent {
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() dialogClosed = new EventEmitter<void>();
  
  taskForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      duration: ['', [Validators.required, Validators.min(1)]]
    });
  }
  
  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: Date.now(), // Generar ID único
        title: this.taskForm.value.title,
        duration: this.taskForm.value.duration
      };
      
      this.taskAdded.emit(newTask);
      this.close();
    }
  }
  
  close() {
    this.dialogClosed.emit();
  }
} 