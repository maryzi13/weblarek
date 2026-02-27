import { Card } from './Card';
import { IEvents } from '../../base/Events';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

export class CatalogCard extends Card {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.container.dataset.id });
        });
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