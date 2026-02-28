import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export interface IFormActions<T> {
  onSubmit?: () => void;
  onChange?: (field: keyof T, value: string) => void;
}

export abstract class Form<T> extends Component<Partial<T>> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    protected container: HTMLFormElement,
    actions?: IFormActions<T>
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type=submit]',
      container
    );

    this.errorsElement = ensureElement<HTMLElement>(
      '.form__errors',
      container
    );

    container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      actions?.onChange?.(field, value);
    });

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      actions?.onSubmit?.();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}