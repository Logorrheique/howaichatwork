import { Component,signal,input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-hello',
  styleUrl: './hello.css',
  templateUrl: './hello.html',
})
export class Hello {
  mysig = signal("This is the hello signal")
  m2 = input();
}
