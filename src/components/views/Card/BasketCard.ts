import { Card } from './Card'; 
import { IProduct } from '../../../types'; 
import { ensureElement } from '../../../utils/utils'; 
 
interface IBasketCardData extends IProduct { 
    index: number; 
} 
 
interface IBasketCardActions {
  onDelete?: () => void;
}

export class BasketCard extends Card<IBasketCardData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketCardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index',
      container
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      container
    );

    if (actions?.onDelete) {
      this.deleteButton.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}