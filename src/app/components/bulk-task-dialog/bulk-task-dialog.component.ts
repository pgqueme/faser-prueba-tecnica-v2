import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bulk-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-overlay" (click)="close()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>Carga masiva de tareas</h2>
        <textarea 
          [(ngModel)]="bulkText" 
          rows="8" 
          class="form-control" 
          placeholder="Escribe cada tarea en una línea. Ejemplo: Tarea|5">
        </textarea>
        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" (click)="close()">Cancelar</button>
          <button type="button" class="btn btn-primary" (click)="processBulk()">Agregar tareas</button>
        </div>
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
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
      margin-bottom: 1rem;
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
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class BulkTaskDialogComponent {
  /**
   * Texto ingresado por el usuario para la carga masiva.
   */
  bulkText = '';

  /**
   * Evento emitido con el arreglo de tareas procesadas.
   */
  @Output() tasksBulkAdded = new EventEmitter<{ title: string; duration: number }[]>();
  /**
   * Evento emitido al cerrar el diálogo.
   */
  @Output() dialogClosed = new EventEmitter<void>();

  /**
   * Procesa el texto ingresado y emite las tareas generadas.
   */
  processBulk() {
    const lines = this.bulkText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const tasks = lines.map(line => {
      // Si la línea contiene '|', separamos título y duración
      const match = line.match(/^(.*)\|(\d+)$/);
      if (match) {
        return { title: match[1].trim(), duration: Number(match[2]) };
      } else {
        // Si no, duración por defecto 10
        return { title: line, duration: 10 };
      }
    });
    this.tasksBulkAdded.emit(tasks);
    this.close();
  }

  /**
   * Cierra el diálogo.
   */
  close() {
    this.dialogClosed.emit();
  }
}
