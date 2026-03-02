import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { ensureAllElements } from '../../../utils/utils';
import { TPayment } from '../../../types';

interface IOrderForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>(
            '.button_alt',
            container
        );

        this.paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.onInputChange('payment', btn.name as TPayment);
            });
        });
    }

    set payment(name: TPayment) {
        this.paymentButtons.forEach(btn => {
            btn.classList.toggle(
                'button_alt-active',
                btn.name === name
            );
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value =
            value;
    }
}