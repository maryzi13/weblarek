import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';

export abstract class Card<T = IProduct> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(protected container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;
  }

  render(data: T & { id?: string }): HTMLElement {
    if (data.id) {
      this.container.dataset.id = data.id;
    }
    return super.render(data);
  }
}