type type = 'sms' | 'letter';
export class Sender {
  public type: string;
  constructor(type: string) {
    this.type = type;
  }
}