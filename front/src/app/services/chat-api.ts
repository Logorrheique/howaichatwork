import { HttpClient, HttpDownloadProgressEvent, HttpEventType } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ChatAPI {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/chat';
  private sub?: Subscription;

  readonly messages = signal<ChatMessage[]>([]);
  readonly response = signal('');
  readonly loading = signal(false);
  readonly error = signal('');

  getResultOfPrompt(text: string): void {
    const prompt = text.trim();
    if (!prompt) return;

    this.stop();
    this.response.set('');
    this.error.set('');
    this.loading.set(true);

    const history: ChatMessage[] = [...this.messages(), { role: 'user', content: prompt }];
    this.messages.set(history);

    this.sub = this.http
      .post(this.url, { messages: history }, {
        observe: 'events',
        responseType: 'text',
        reportProgress: true,
      })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const raw = (event as HttpDownloadProgressEvent).partialText ?? '';
            this.response.set(this.parseSse(raw));
          }
        },
        error: (e) => {
          this.error.set(e.message ?? 'Erreur');
          this.loading.set(false);
        },
        complete: () => {
          const answer = this.response();

          if (answer) {
            this.messages.update((m) => [...m, { role: 'assistant', content: answer }]);
          }
          this.loading.set(false);
        },
      });
  }

  stop(): void {
    this.sub?.unsubscribe();
    this.loading.set(false);
  }

  private parseSse(raw: string): string {
    return raw
      .split('\n')
      .filter((l) => l.startsWith('data:'))
      .map((l) => {
        try {
          return (JSON.parse(l.slice(5).trim()) as { delta?: string }).delta ?? '';
        } catch {
          return ''; // ligne incomplète ou invalide, ignorée
        }
      })
      .join('');
  }
}