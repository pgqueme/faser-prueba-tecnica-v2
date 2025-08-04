import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-overlay" (click)="close()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>Editar Tarea</h2>
        <form [formGroup]="taskForm" (ngSubmit)="onSave()">
          <div class="form-group">
            <label for="title">Título:</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="form-control"
            />
            <div class="error" *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
              El título es requerido.
            </div>
          </div>

          <div class="form-group">
            <label for="duration">Duración (minutos):</label>
            <input
              type="number"
              id="duration"
              formControlName="duration"
              class="form-control"
              min="1"
            />
            <div class="error" *ngIf="taskForm.get('duration')?.invalid && taskForm.get('duration')?.touched">
              La duración debe ser mayor a 0.
            </div>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="close()">Cancelar</button>
            <button type="button" class="btn btn-danger" (click)="onDelete()">Eliminar</button>
            <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:1000;
    }
    .dialog-content {
      background:#fff;
      padding:1.5rem;
      border-radius:8px;
      width:360px;
      box-shadow:0 8px 24px rgba(0,0,0,0.2);
    }
    .form-group { margin-bottom:1rem; }
    label { display:block; font-weight:600; margin-bottom:4px; }
    .form-control {
      width:100%;
      padding:8px;
      border:1px solid #ccc;
      border-radius:4px;
      box-sizing:border-box;
    }
    .error { color:#dc3545; font-size:0.85rem; margin-top:4px; }
    .dialog-actions {
      display:flex;
      gap:8px;
      justify-content:flex-end;
      margin-top:1rem;
      flex-wrap: wrap;
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
    .btn-danger { background:#dc3545; color:#fff; }
  `]
})
export class EditTaskDialogComponent implements OnInit {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() dialogClosed = new EventEmitter<void>();

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: [this.task?.title ?? '', [Validators.required]],
      duration: [this.task?.duration ?? 10, [Validators.required, Validators.min(1)]],
    });
  }

  onSave() {
    if (this.taskForm.valid) {
      const value = this.taskForm.value;
      const updated: Task = {
        id: this.task.id,
        title: value.title ?? '',
        duration: value.duration ?? 10,
      };
      this.taskUpdated.emit(updated);
      this.close();
    }
  }

  onDelete() {
    this.taskDeleted.emit(this.task.id);
    this.close();
  }

  close() {
    this.dialogClosed.emit();
  }
}
