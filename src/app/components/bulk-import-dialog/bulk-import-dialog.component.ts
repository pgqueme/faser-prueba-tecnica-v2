import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

/** Dialogo simple para pegar varias líneas y convertirlas en tareas.
 *  Formato por línea:  Título|MINUTOS     (si no hay |n => duración 10)
 */
@Component({
  selector: 'app-bulk-import-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-overlay" (click)="close()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>Carga masiva</h2>

        <p style="margin:0 0 .5rem">
          Una por línea. Ejemplos:
        </p>
        <pre style="background:#f7f7f7;padding:.5rem;border-radius:6px;margin:0 0 .5rem">
Primera tarea|4
Segunda tarea|15
Tercera sin duración
Cuarta|6
        </pre>

        <textarea [(ngModel)]="raw" rows="10" class="form-control"
          placeholder="Pega aquí las tareas..."></textarea>

        <div class="dialog-actions">
          <button class="btn btn-secondary" (click)="close()">Cancelar</button>
          <button class="btn btn-primary" (click)="insert()">Insertar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center;z-index:1000}
    .dialog-content{background:#fff;padding:2rem;border-radius:8px;min-width:500px;max-width:90vw}
    .form-control{width:100%;padding:.75rem;border:1px solid #ddd;border-radius:4px;box-sizing:border-box}
    .dialog-actions{display:flex;justify-content:center;gap:1rem;margin-top:1rem}
    .btn{padding:.6rem 1.2rem;border:none;border-radius:4px;cursor:pointer}
    .btn-primary{background:#007bff;color:#fff}
    .btn-secondary{background:#6c757d;color:#fff}
  `]
})
export class BulkImportDialogComponent {
  @Output() tasksAdded = new EventEmitter<Task[]>();
  @Output() dialogClosed = new EventEmitter<void>();

  raw = '';

  insert() {
    const lines = this.raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const now = Date.now();
    const tasks: Task[] = lines.map((line, i) => {
      const m = line.match(/^(.*?)(?:\|(\d+))?$/);
      const title = (m?.[1] ?? line).trim();
      const duration = Math.max(1, Number(m?.[2] ?? 10));
      return { id: now + i, title, duration };
    });
    if (tasks.length) this.tasksAdded.emit(tasks);
    this.close();
  }

  close(){ this.dialogClosed.emit(); }
}
