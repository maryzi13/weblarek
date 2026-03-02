import { Card } from './Card'; 
import { IEvents } from '../../base/Events'; 
import { IProduct } from '../../../types'; 
import { ensureElement } from '../../../utils/utils'; 
 
interface IBasketCardData extends IProduct { 
    index: number; 
} 
 
export class BasketCard extends Card<IBasketCardData> { 
    protected indexElement: HTMLElement; 
    protected deleteButton: HTMLButtonElement; 
 
    constructor(container: HTMLElement, protected events: IEvents) { 
        super(container); 
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container); 
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container); 
 
        this.deleteButton.addEventListener('click', () => { 
            this.events.emit('basket:remove'); 
        }); 
    } 
 
    set index(value: number) { 
        this.indexElement.textContent = String(value); 
    } 
}