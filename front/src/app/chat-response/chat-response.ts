import { Component, inject, input, signal } from '@angular/core';
import { Todo } from '../model/Todo';
import { ChatAPI } from '../services/chat-api';

@Component({
  imports: [],
  selector: 'app-chat-response',
  styleUrl: './chat-response.css',
  templateUrl: './chat-response.html',
})
export class ChatResponse {
  answer = input<Todo[]>()
  listTodo = inject(ChatAPI)
  getData(){
    console.log(this.answer)
  }
}
