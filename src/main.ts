import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { ensureElement } from './utils/utils';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { WebLarekApi } from './components/services/WebLarekApi';

import { Products } from './components/models/products';
import { Basket as BasketModel } from './components/models/basket';
import { Buyer } from './components/models/buyer';

import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { PreviewCard } from './components/views/Card/PreviewCard';
import { BasketCard } from './components/views/Card/BasketCard';

import { Basket } from './components/views/Basket';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { OrderForm } from './components/views/Forms/OrderForm';
import { ContactsForm } from './components/views/Forms/ContactsForm';
import { Success } from './components/views/Success';

import { IOrderRequest, IBuyer, TPayment} from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

const productsModel = new Products(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);

const header = new Header(
  events,
  ensureElement<HTMLElement>('.header')
);

const gallery = new Gallery(
  ensureElement<HTMLElement>('.page')
);

const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  events
);

const basketView = new Basket(
  cloneTemplate('#basket'),
  events
);

const previewCard = new PreviewCard(cloneTemplate('#card-preview'), events);
const orderForm = new OrderForm(cloneTemplate('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);
const success = new Success(cloneTemplate('#success'), events)

events.on('products:changed', () => {
  const itemCards = productsModel.getItems().map((item) => {
  const card = new CardCatalog(cloneTemplate('#card-catalog'), {
      onClick: () => events.emit('card:select', item),
    });

    return card.render({
      ...item,
      image: CDN_URL + item.image
    });
  });

  gallery.render({ catalog: itemCards });
});

events.on('preview:changed', () => {
  const item = productsModel.getPreview();

  if (!item) {
    return;
  }

  const isUnavailable = item.price === null;

  modal.render({
    content: previewCard.render({
      ...item,
      image: CDN_URL + item.image,
      buttonText: isUnavailable
        ? 'Недоступно'
        : basketModel.hasItem(item.id)
          ? 'Удалить из корзины'
          : 'В корзину',
      buttonDisabled: isUnavailable
    })
  });
});

events.on('basket:changed', () => {
  const items = basketModel.getItems();

  header.render({
    counter: basketModel.getCount()
  });

  const cards = items.map((item, index) => {
    const card = new BasketCard(cloneTemplate('#card-basket'), events);

    return card.render({
      ...item,
      index: index + 1
    });
  });

  basketView.render({
    items: cards,
    total: basketModel.getTotalPrice(),
    buttonDisabled: items.length === 0
  });
});

events.on('buyer:changed', (buyerData: IBuyer) => {
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;

  const orderErrors = buyerModel.validate(['payment', 'address']);
  orderForm.valid = Object.keys(orderErrors).length === 0;
  orderForm.errors = Object.values(orderErrors).join(', ');

  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;

  const contactsErrors = buyerModel.validate(['email', 'phone']);
  contactsForm.valid = Object.keys(contactsErrors).length === 0;
  contactsForm.errors = Object.values(contactsErrors).join(', ');
});

events.on('card:select', ({ id }: { id: string }) => {
  const item = productsModel.getItem(id); 
  if (item) { 
    productsModel.setPreview(item); 
  } 
});

events.on('card:toggleBasket', () => {
  const item = productsModel.getPreview();
  if (!item) return;

  if (basketModel.hasItem(item.id)) {
    basketModel.removeItem(item);
  } else {
    basketModel.addItem(item);
  }

  modal.close();
});

events.on('basket:remove', ({ id }: { id: string }) => { 
  const item = productsModel.getItem(id);
  if (item) { 
    basketModel.removeItem(item); 
  } 
}); 

events.on('basket:open', () => {
  modal.render({
    content: basketView.render()
  });
});

events.on('order:open', () => {
  modal.render({
    content: orderForm.render({
      ...buyerModel.getData()
    })
  });
});

events.on(/order\..*:change/, (data: { field: string; value: string }) => { 
  const { field, value } = data; 
  buyerModel.setData({ [field]: value } as any); 
}); 
 
events.on(/contacts\..*:change/, (data: { field: string; value: string }) => { 
  const { field, value } = data; 
  buyerModel.setData({ [field]: value } as any); 
}); 

events.on('order:submit', () => {
  modal.render({
    content: contactsForm.render({
      ...buyerModel.getData()
    })
  });
});

events.on('contacts:submit', async () => {
  
  const order: IOrderRequest = {
    ...buyerModel.getData(),
    items: basketModel.getItems().map(i => i.id),
    total: basketModel.getTotalPrice()
  };

  try {
    const response = await weblarekApi.createOrder(order);

    modal.render({
      content: success.render({
        total: response.total
      })
    });

    basketModel.clear();
    buyerModel.clear();

  } catch (err) {
    contactsForm.errors = String(err);
  }
});

events.on('success:close', () => {
  modal.close();
});

weblarekApi.getProducts()
  .then((products) => {
    productsModel.setItems(products);
    events.emit('products:changed');
    events.emit('basket:changed');
  })
  .catch(console.error);

