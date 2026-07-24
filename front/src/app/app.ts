import { Component, signal, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatInput } from './chat-input/chat-input';

@Component({
  imports: [RouterOutlet, ChatInput,],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('howaichatwork');
  anothersig = signal('sig from app')
}
