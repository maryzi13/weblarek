import { Card } from './Card'; 
import { IProduct } from '../../../types'; 
import { categoryMap } from '../../../utils/constants'; 
import { ensureElement } from '../../../utils/utils'; 
 
interface IPreviewData extends IProduct {
  buttonText: string;
  buttonDisabled: boolean;
}

interface IPreviewCardActions {
  onButtonClick?: () => void;
}

export class PreviewCard extends Card<IPreviewData> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IPreviewCardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      '.card__category',
      container
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      '.card__image',
      container
    );

    this.descriptionElement = ensureElement<HTMLElement>(
      '.card__text',
      container
    );

    this.buttonElement = ensureElement<HTMLButtonElement>(
      '.card__button',
      container
    );

    if (actions?.onButtonClick) {
      this.buttonElement.addEventListener('click', actions.onButtonClick);
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}