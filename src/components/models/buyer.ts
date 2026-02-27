import { IBuyer, TPayment, TBuyerErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
  private payment: TPayment = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(protected events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.events.emit('buyer:changed', this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(fields?: (keyof IBuyer)[]): TBuyerErrors {
  const errors: TBuyerErrors = {};
  const fieldsToCheck = fields || ['payment', 'address', 'email', 'phone'];

  if (fieldsToCheck.includes('payment') && !this.payment) {
    errors.payment = 'Выберите способ оплаты';
  }
  if (fieldsToCheck.includes('email') && !this.email.trim()) {
    errors.email = 'Необходимо указать email';
  }
  if (fieldsToCheck.includes('phone') && !this.phone.trim()) {
    errors.phone = 'Необходимо указать телефон';
  }
  if (fieldsToCheck.includes('address') && !this.address.trim()) {
    errors.address = 'Необходимо указать адрес';
  }

  return errors;
}
}