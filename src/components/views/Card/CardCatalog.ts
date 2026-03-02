import { Card } from './Card'; 
import { categoryMap } from '../../../utils/constants'; 
import { ensureElement } from '../../../utils/utils'; 
import { IProduct } from '../../../types';
 
interface ICardActions {
  onClick?: () => void;
}

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
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

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }
}