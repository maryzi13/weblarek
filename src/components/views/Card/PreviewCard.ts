import { Card } from './Card';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

interface IPreviewData extends IProduct {
    inBasket: boolean;
}

export class PreviewCard extends Card<IPreviewData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', () => {
            const eventName = this.container.dataset.inBasket === 'true'
                ? 'card:removeFromBasket'
                : 'card:toBasket';
            this.events.emit(eventName, { id: this.container.dataset.id });
        });
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
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

    set inBasket(value: boolean) {
        this.container.dataset.inBasket = String(value);
        this.buttonElement.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }
}