import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Todo } from '../model/todo.model';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as fromTodo from '../todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements OnInit {
  @Input() todo: Todo;
  @ViewChild('txtInputFisico') txtInputFisico: ElementRef;

  chkField: FormControl;
  txtInput: FormControl;

  editando: boolean;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.chkField = new FormControl(this.todo.completado);
    this.txtInput = new FormControl(this.todo.texto, Validators.required);

    this.chkField.valueChanges.subscribe(() => {
      const action = new fromTodo.ToggleTodoAction(this.todo.id);
      this.store.dispatch(action);
    });
  }

  editar() {
    this.editando = true;
    console.log('texto', this.todo.texto);
    console.log('formControl', this.txtInput.value);

    setTimeout(() => {
      this.txtInputFisico.nativeElement.select();
    }, 1);
  }

  terminarEdicion() {
    this.editando = false;

    if (this.txtInput.invalid) {
      this.txtInput.setValue(this.todo.texto);
      return;
    }

    if (this.txtInput.value === this.todo.texto) {
      return;
    }

    const accion = new fromTodo.EditarTodoAction(this.todo.id, this.txtInput.value);
    this.store.dispatch(accion);
  }

  eliminar() {
    const accion = new fromTodo.EliminarTodoAction(this.todo.id);
    this.store.dispatch(accion);
  }

}
