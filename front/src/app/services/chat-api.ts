import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Todo } from '../model/Todo';
import { todo } from 'node:test';
@Service()
export class ChatAPI {
  private http = inject(HttpClient);
  private baseUrl = '/api/';

  chatresponse = signal<Todo[]>([])
  loading = signal(false);
  error = signal<string | null>(null);

  getAllTodos() {
    console.log(this.baseUrl)
    this.http.get<Todo[]>(this.baseUrl).subscribe({
      next: (todos) => {
        this.chatresponse.set(todos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les données');
        this.loading.set(false);
      },
    });
  }

}
