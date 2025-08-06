import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-bulk-upload-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-overlay" (click)="close()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>Carga masiva de tareas</h2>
        <p class="hint">
          Una tarea por línea. Formato: <code>Título de tarea|duración</code>. Si no hay duración válida, se usa 10 minutos.
        </p>
        <form [formGroup]="form">
          <textarea
            formControlName="rawText"
            rows="8"
            placeholder="Primera tarea|4&#10;Segunda tarea de mayor duración|15&#10;Tercera tarea sin duración&#10;Cuarta tarea|6"
          ></textarea>
        </form>

        <div class="actions">
          <button class="btn btn-secondary" (click)="close()">Cancelar</button>
          <button class="btn btn-primary" (click)="parseAndEmit()" [disabled]="!hasAnyLine()">Agregar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:1000;
    }
    .dialog-content {
      background:#fff;
      padding:1.5rem;
      border-radius:8px;
      width:500px;
      max-width:90%;
      box-shadow:0 12px 32px rgba(0,0,0,0.2);
      display:flex;
      flex-direction:column;
      gap:0.5rem;
    }
    h2 {
      margin:0 0 0.5rem;
    }
    .hint {
      font-size:0.85rem;
      margin:0 0 0.5rem;
      color:#555;
    }
    textarea {
      width:100%;
      resize: vertical;
      padding:8px;
      font-family: monospace;
      font-size:0.9rem;
      border:1px solid #ccc;
      border-radius:4px;
      box-sizing:border-box;
      min-height:150px;
    }
    .actions {
      margin-top:0.5rem;
      display:flex;
      justify-content:flex-end;
      gap:8px;
    }
    .btn {
      padding:0.6rem 1rem;
      border:none;
      border-radius:4px;
      cursor:pointer;
      font-size:0.9rem;
    }
    .btn-primary { background:#007bff; color:#fff; }
    .btn-secondary { background:#6c757d; color:#fff; }
  `]
})
export class BulkUploadDialogComponent {
  @Output() tasksParsed = new EventEmitter<Task[]>();
  @Output() dialogClosed = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rawText: ['']
    });
  }

  hasAnyLine(): boolean {
    const text: string = this.form.value.rawText || '';
    return text.trim().length > 0;
  }

  parseAndEmit() {
    const raw: string = this.form.value.rawText || '';
    const lines = raw.split(/\r?\n/);
    const tasks: Task[] = lines
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(line => {
        let title = line;
        let duration = 10;

        const lastPipe = line.lastIndexOf('|');
        if (lastPipe !== -1) {
          const possibleDuration = line.slice(lastPipe + 1).trim();
          const parsed = parseInt(possibleDuration, 10);
          if (!isNaN(parsed) && parsed > 0) {
            duration = parsed;
          }
          title = line.slice(0, lastPipe).trim();
        }

        return {
          id: Date.now() + Math.floor(Math.random() * 1000),
          title,
          duration,
        } as Task;
      });

    if (tasks.length) {
      this.tasksParsed.emit(tasks);
    }
    this.close();
  }

  close() {
    this.dialogClosed.emit();
  }
}
