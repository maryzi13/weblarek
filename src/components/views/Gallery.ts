import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogContainer = ensureElement<HTMLElement>('.gallery', container);
  }

  set catalog(items: HTMLElement[]) {
    this.catalogContainer.replaceChildren(...items);
  }
}