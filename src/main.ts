import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { WebLarekApi } from './components/services/WebLarekApi';
import { Products } from './components/models/products';
import { Basket } from './components/models/basket';
import { Buyer } from './components/models/buyer';
import { apiProducts } from './utils/data'; 

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

// Products
productsModel.setItems(apiProducts.items);
console.log(productsModel.getItems());

const firstProduct = productsModel.getItem(apiProducts.items[0].id);
console.log(firstProduct);

if (firstProduct) {
  productsModel.setPreview(firstProduct);
}
console.log(productsModel.getPreview());


// Basket
if (firstProduct) {
  basketModel.addItem(firstProduct);
}
console.log(basketModel.getItems());

if (firstProduct) {
  console.log(basketModel.hasItem(firstProduct.id));
}

console.log(basketModel.getCount());

console.log(basketModel.getTotalPrice());

if (firstProduct) {
  basketModel.removeItem(firstProduct);
}
console.log(basketModel.getItems());

basketModel.clear();
console.log(basketModel.getItems());


// Buyer

console.log('Пустая модель:', buyerModel.getData());
console.log('Ошибки:', buyerModel.validate());

buyerModel.setData({ email: 'test@mail.com' });
console.log('После email:', buyerModel.getData());
console.log('Ошибки:', buyerModel.validate());

buyerModel.setData({ phone: '+79991234567' });
console.log('После phone:', buyerModel.getData());
console.log('Ошибки:', buyerModel.validate());

buyerModel.setData({ address: 'Москва' });
console.log('После address:', buyerModel.getData());
console.log('Ошибки:', buyerModel.validate());

buyerModel.setData({ payment: 'card' });
console.log('После payment:', buyerModel.getData());
console.log('Ошибки:', buyerModel.validate());

buyerModel.clear();
console.log('После очистки:', buyerModel.getData());
console.log('Ошибки:', buyerModel.validate());

// Api
const apiInstance = new Api(API_URL);
const webLarekApi = new WebLarekApi(apiInstance);

(async () => {
  try {
    const serverProducts = await webLarekApi.getProducts();
    console.log('Товары с сервера:', serverProducts);

    productsModel.setItems(serverProducts);
    console.log(productsModel.getItems());

  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
  }
})();