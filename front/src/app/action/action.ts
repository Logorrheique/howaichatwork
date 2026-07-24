import { Component,signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-action',
  styleUrl: './action.css',
  templateUrl: './action.html',
})
export class Action {
  counter = signal(0)
  Increment(){
    this.counter.update((v)=>v+1);
  }
  Decrement(){
    this.counter.update((v)=>v-1);
  }
  Reset(){
    this.counter.set(0)
  }
}
