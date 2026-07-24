import { Component, signal, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { ChatInput } from './chat-input/chat-input';
import { ChatResponse } from './chat-response/chat-response';

@Component({
  imports: [RouterOutlet,Navbar,ChatInput,ChatResponse],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('howaichatwork');
  anothersig = signal('sig from app')
}
