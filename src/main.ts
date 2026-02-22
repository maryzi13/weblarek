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

buyerModel.setData({
  payment: 'card',
  email: 'test@mail.com',
  phone: '+79991234567',
  address: 'Москва'
});
console.log(buyerModel.getData());

console.log(buyerModel.validate());

buyerModel.clear();
console.log(buyerModel.getData());

console.log(buyerModel.validate());


// Api
const apiInstance = new Api(API_URL);
const webLarekApi = new WebLarekApi(apiInstance);

(async () => {
  const serverProducts = await webLarekApi.getProducts();
  console.log(serverProducts);

  productsModel.setItems(serverProducts);
  console.log(productsModel.getItems());
})();