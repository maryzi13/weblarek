import { IBuyer, TPayment, TBuyerErrors } from '../../types';

export class Buyer {
  private payment: TPayment = 'card';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
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
    this.payment = 'card';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    if (!this.address.trim()) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}