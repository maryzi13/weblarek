import { Card } from './Card'; 
import { categoryMap } from '../../../utils/constants'; 
import { ensureElement } from '../../../utils/utils'; 
 
interface ICatalogCardActions {
  onClick?: () => void;
}

export class CatalogCard extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICatalogCardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      '.card__category',
      container
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      '.card__image',
      container
    );

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const modifier = categoryMap[value as keyof typeof categoryMap] || '';
    this.categoryElement.className = `card__category ${modifier}`;
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }
}