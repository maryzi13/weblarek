import { Form } from './Form';

interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value =
      value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value =
      value;
  }
}