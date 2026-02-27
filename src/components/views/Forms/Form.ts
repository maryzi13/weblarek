import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export abstract class Form<T> extends Component<Partial<T>> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

        container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });
    }

    protected onInputChange<K extends keyof T>(field: K, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value,
        } as { field: K; value: string });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}