import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { WebLarekApi } from './components/base/services/WeblarekApi';
import { Products } from './components/base/models/products';

console.clear();
console.log('=== ТЕСТ СЕРВЕРА ===');

const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);
const productsModel = new Products();

webLarekApi.getProducts()
  .then((items) => {
    productsModel.setItems(items);
    console.log('Каталог с сервера:', productsModel.getItems());
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });