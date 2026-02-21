import { IProduct } from '../../../types';

export class Products {
  private _items: IProduct[] = [];
  private _preview: IProduct | null = null;

  // сохранить массив товаров
  setItems(items: IProduct[]): void {
    this._items = items;
  }

  // получить массив товаров
  getItems(): IProduct[] {
    return this._items;
  }

  // получить товар по id
  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  // сохранить товар для подробного просмотра
  setPreview(item: IProduct): void {
    this._preview = item;
  }

  // получить товар для подробного просмотра
  getPreview(): IProduct | null {
    return this._preview;
  }
}