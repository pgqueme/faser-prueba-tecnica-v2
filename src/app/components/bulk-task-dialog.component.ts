import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-bulk-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-overlay" (click)="close()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>Carga Masiva de Tareas</h2>
        <form [formGroup]="bulkForm" (ngSubmit)="submit()">
          <textarea formControlName="rawText" rows="10" class="form-control"
            placeholder="Ej: Tarea importante|5&#10;Otra tarea|12&#10;Sin duración"></textarea>
          
          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="close()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Agregar</button>
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

  .btn-danger {
    background-color: #dc3545;
    color: white;
  }
  
  .error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .btn-danger:hover {
    background-color: #c82333;
  }
`]
})
export class BulkTaskDialogComponent {
  //Evento emitido al confirmar la carga masiva
  @Output() tasksAdded = new EventEmitter<{ title: string; duration: number }[]>();
  //Evento emitido al cerrar el diálogo sin agregar tareas
  @Output() dialogClosed = new EventEmitter<void>();

  bulkForm: FormGroup;

  constructor(private fb: FormBuilder) {
     //Inicialización del formulario reactivo con un solo campo de texto
    this.bulkForm = this.fb.group({
      rawText: ['']
    });
  }
  //Método para procesar el texto ingresado y emitir las tareas
  submit() {
    const text = this.bulkForm.value.rawText || '';
    const lines = text.split('\n');

    const tasks = lines.map((line: string): Task => {
    const parts = line.split('|');
    const title = parts[0].trim();
    const duration = parts[1] ? parseInt(parts[1].trim()) : 10;

    return {
      id: Date.now() + Math.floor(Math.random() * 1000), // genera un ID único
      title,
      duration: isNaN(duration) ? 10 : duration, // asegura que la duración sea un número válido
    };
  }).filter((task: Task) => task.title.length > 0);// Filtra tareas sin título

    this.tasksAdded.emit(tasks);
  }

  //Método para cerrar el diálogo
  close() {
    this.dialogClosed.emit();
  }
}
