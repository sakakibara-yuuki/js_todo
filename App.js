/*
 * App.js
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */



export class App {

  checked = 0;

  createCheckBox() {
    // create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
      if (checkbox.value !== 'on') {

        // change label
        const checkedLabel = checkbox.parentElement.querySelector('s');
        const label = checkedLabel.querySelector('label');
        const newLabel = document.createElement('label');
        newLabel.textContent = label.textContent;
        checkedLabel.replaceWith(newLabel);

        // change label
        this.checked--;
        console.log(`checked: ${this.checked}`);
        checkbox.value = 'on';

        this.updateCount();

      } else {

        // change label
        const label = checkbox.parentElement.querySelector('label');
        const newLabel = document.createElement('label');
        const checkedLabel = document.createElement('s');
        newLabel.textContent = label.textContent;
        checkedLabel.append(newLabel);
        label.replaceWith(checkedLabel);

        // change label
        this.checked++;
        console.log(`check: ${this.checked}`);
        checkbox.value = 'off';

        this.updateCount();

      }
    });
    return checkbox;
  }

  createLabel(string) {
    // create label
    const label = document.createElement('label');
    label.textContent = string;
    return label;
  }

  createDeleteButton() {
    // create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteButton.closest("ul").removeChild(deleteButton.closest("li"));
      this.updateCount();
    });
    return deleteButton;
  }

  createEditButton(label) {
    // create edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      event.preventDefault();

      // change input
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'what to do';
      label.replaceWith(input);

      // change edit button to save button
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.addEventListener('click', () => {
        label.textContent = input.value;
        input.replaceWith(label);
        event.target.replaceWith(editButton);
      });
      event.target.replaceWith(saveButton);

    });

    return editButton;
  }


  createTodoItem(string) {

    const todoItem = document.createElement('li');

    // create todoForm
    const todoForm = document.createElement('form');
    const checkbox = this.createCheckBox();
    const label = this.createLabel(string);
    const editButton = this.createEditButton(label);
    const deleteButton = this.createDeleteButton();
    todoForm.append(checkbox);
    todoForm.append(label);
    todoForm.append(editButton);
    todoForm.append(deleteButton);

    todoItem.append(todoForm);
    return todoItem;
  }

  updateCount() {
    const total = document.querySelector('.js-total');
    const done = document.querySelector('.js-done');
    const doing = document.querySelector('.js-doing');
    const todoList = document.querySelector('.js-todo-list');

    console.log(todoList.children.length);
    total.innerHTML = `Total: ${todoList.children.length}`;
    done.innerHTML = `Done: ${this.checked}`;
    doing.innerHTML = `Doing: ${todoList.children.length - this.checked}`;
  }

  mount() {
    //create input
    const inputText = document.querySelector('.js-header input');
    const inputButton = document.querySelector('.js-header button');
    // create todoList
    const todoList = document.querySelector('.js-todo-list');

    inputButton.addEventListener('click', (event) => {
      event.preventDefault();
      const todoItem = this.createTodoItem(inputText.value);
      inputText.value = '';
      todoList.append(todoItem);
      this.updateCount();
    });

  }
}
