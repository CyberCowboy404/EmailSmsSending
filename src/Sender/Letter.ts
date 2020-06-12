import { Sender, SenderConstructor } from './Sender';
export class Letter extends Sender {
  constructor({ type, contacts, content }: SenderConstructor) {
    super({ type, contacts, content });
  }
}