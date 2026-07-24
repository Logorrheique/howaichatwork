import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { ChatAPI } from '../services/chat-api';

@Component({
  selector: 'app-chat-input',
  imports: [HlmInputImports, HlmFieldImports, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './chat-input.html',
})
export class ChatInput {
  protected readonly chatApi = inject(ChatAPI);

}