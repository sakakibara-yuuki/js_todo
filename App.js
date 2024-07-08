/*
 * Bpp.js
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */
let todoIds = 1;


class TodoItem extends EventTarget {


  constructor(label) {
    super();
    this.id = todoIds++;
    this.checked = false;
    this.label = label;

    this.todoItemView = this.createView();
    this.checkbox = this.createCheckbox();
    this.todoLabel = this.createTodoLabel();
    this.input = this.createInput();
    this.editButton = this.createEditButton();
    this.deleteButton = this.createDeleteButton();
    this.saveButton = this.createSaveButton();

    this.todoItemView.querySelector('form').append(this.checkbox);
    this.todoItemView.querySelector('form').append(this.todoLabel);
    this.todoItemView.querySelector('form').append(this.editButton);
    this.todoItemView.querySelector('form').append(this.deleteButton);
  }

  createView() {
    const todoItemView = document.createElement('li');
    todoItemView.className = `todo-item-${this.id}`;
    todoItemView.insertAdjacentHTML("afterbegin", `<form></form>`)
    return todoItemView;
  }

  createCheckbox() {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `todo-${this.id}`;
    checkbox.checked = this.checked;
    checkbox.addEventListener('click', this.onCheck.bind(this));
    return checkbox;
  }

  createTodoLabel() {
    const todoLabel = document.createElement('label');
    todoLabel.className = 'todo-label';
    todoLabel.textContent = this.label;
    todoLabel.setAttribute('for', `todo-${this.id}`);
    return todoLabel;
  }

  createInput() {
    const input = document.createElement('input');
    input.className = 'todo-label';
    input.type = 'text';
    input.value = this.label;
    return input;
  }

  createEditButton() {
    const editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', this.onEdit.bind(this));
    return editButton;
  }

  createDeleteButton() {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', this.onDelete.bind(this));
    return deleteButton;
  }

  createSaveButton() {
    const saveButton = document.createElement('button');
    saveButton.className = 'save';
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', this.onSave.bind(this));
    return saveButton;
  }

  onCheck() {
    this.checked = !this.checked;
    const checkEvent = new CustomEvent('check', { bubbles: true});
    event.target.dispatchEvent(checkEvent);
  }

  onEdit() {
    event.preventDefault();
    event.target.replaceWith(this.saveButton);
    this.todoItemView.querySelector('label.todo-label').replaceWith(this.input);
  }

  onSave() {
    event.preventDefault();
    event.target.replaceWith(this.editButton);
    this.todoLabel.textContent = this.input.value;
    this.todoItemView.querySelector('input.todo-label').replaceWith(this.todoLabel);
  }

  onDelete() {
    event.preventDefault();
    const deleteEvent = new CustomEvent('delete', { bubbles: true, detail: {id: this.id}});
    event.target.dispatchEvent(deleteEvent);
    const checkEvent = new CustomEvent('check', { bubbles: true});
    event.target.dispatchEvent(checkEvent);
  }
}

class TodoList extends EventTarget {

  constructor() {
    super();
    this.items = [];
    this.todoList = this.createTodoList();
    this.progressView = document.querySelector('.js-progress');
    this.progressView.addEventListener('check', this.onProgress.bind(this));
  }

  createTodoList(label) {
    const todoList = document.querySelector('.js-todo-list');
    todoList.addEventListener('check', this.onProgress.bind(this));
    todoList.addEventListener('delete', this.onDeleteItem.bind(this));
    return todoList;
  }

  append(todoItem) {
    this.items.push(todoItem);
    this.todoList.append(todoItem.todoItemView);
    this.todoList.dispatchEvent(new CustomEvent('check'));
  }

  onProgress() {
    const total = this.items.length;
    const checkedItems = this.items.filter((item) => item.checked).length;
    const uncheckedItems = total - checkedItems;
    this.progressView.querySelector('.js-total').textContent = `Total: ${total}`;
    this.progressView.querySelector('.js-done').textContent = `Done: ${checkedItems}`;
    this.progressView.querySelector('.js-doing').textContent = `Doing: ${uncheckedItems}`;
  }

  onDeleteItem() {
    this.items = this.items.filter((item) => event.detail.id != item.id);
    this.todoList.querySelector(`li.todo-item-${event.detail.id}`).remove();
    this.todoList.dispatchEvent(new CustomEvent('check'));
  }

}

class Form extends EventTarget {
  constructor() {
    super();
    //create input
    const inputText = document.querySelector('.js-header input');
    const inputButton = document.querySelector('.js-header button');
    const todoList = new TodoList();

    inputButton.addEventListener('click', (event) => {
      event.preventDefault();
      const todoItem = new TodoItem(inputText.value);
      todoList.append(todoItem);
      inputText.value = '';
    });
  }
}


export class App {
  mount() {
    // create todoList
    const todoList = document.querySelector('.js-todo-list');
    const form = new Form(todoList);
  }
}

