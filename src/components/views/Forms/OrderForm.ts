import { Form } from './Form';
import { IFormActions } from './Form';
import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { TPayment } from '../../../types';

interface IOrderForm {
    payment: TPayment | '';
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected errorElement: HTMLElement;

  constructor(container: HTMLFormElement, actions?: IFormActions<IOrderForm>) {
    super(container, actions);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      '.button_alt',
      container
    );

    this.errorElement = ensureElement<HTMLElement>(
      '.form__errors',
      container
    );

    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {

        this.payment = btn.name as TPayment;

        actions?.onChange?.('payment', btn.name);
      });
    });
  }

  set payment(name: TPayment | '') {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === name);
    });
  }

  set address(value: string) {
    const input = this.container.elements.namedItem(
      'address'
    ) as HTMLInputElement;

    if (input) {
      input.value = value;
    }
  }

  set errors(message: string) {
    this.errorElement.textContent = message;
  }
}