import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { WebLarekApi } from './components/services/WebLarekApi';

import { Products } from './components/models/products';
import { Basket as BasketModel } from './components/models/basket';
import { Buyer } from './components/models/buyer';

import { Gallery } from './components/views/Card/Gallery';
import { CatalogCard } from './components/views/Card/CardCatalog';
import { PreviewCard } from './components/views/Card/PreviewCard';
import { BasketCard } from './components/views/Card/BasketCard';

import { Basket } from './components/views/Basket';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { OrderForm } from './components/views/Forms/OrderForm';
import { ContactsForm } from './components/views/Forms/ContactsForm';
import { Success } from './components/views/Success';

import { IProduct, IOrderRequest } from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

const productsModel = new Products(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);

const header = new Header(
  events,
  document.querySelector('.header') as HTMLElement
);

const gallery = new Gallery(
  document.querySelector('.page') as HTMLElement
);

const modal = new Modal(
  document.getElementById('modal-container') as HTMLElement,
  events
);

const basketView = new Basket(
  cloneTemplate('#basket'),
  events
);

const orderForm = new OrderForm(
  cloneTemplate('#order') as HTMLFormElement,
  events
);

const contactsForm = new ContactsForm(
  cloneTemplate('#contacts') as HTMLFormElement,
  events
);

events.on('products:changed', () => {
  const items = productsModel.getItems();

  const cards = items.map((item) => {
    const card = new CatalogCard(
      cloneTemplate('#card-catalog'),
      events
    );

    return card.render({
      ...item,
      image: CDN_URL + item.image
    });
  });

  gallery.render({ catalog: cards });
});

events.on('preview:changed', (item: IProduct) => {
  const card = new PreviewCard(
    cloneTemplate('#card-preview'),
    events
  );

  modal.render({
    content: card.render({
      ...item,
      image: CDN_URL + item.image,
      inBasket: basketModel.hasItem(item.id)
    })
  });
});

events.on('basket:changed', () => {
  const items = basketModel.getItems();

  header.render({
    counter: basketModel.getCount()
  });

  const cards = items.map((item, index) => {
    const card = new BasketCard(
      cloneTemplate('#card-basket'),
      events
    );

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

events.on('buyer:changed', () => {
  const orderErrors = buyerModel.validate(['payment', 'address']);
  orderForm.valid = Object.keys(orderErrors).length === 0;
  orderForm.errors = Object.values(orderErrors).join(', ');

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

events.on('card:toBasket', ({ id }: { id: string }) => {
  const item = productsModel.getItem(id);
  if (item) {
    basketModel.addItem(item);
    modal.close();
  }
});

events.on('card:removeFromBasket', ({ id }: { id: string }) => {
  const item = productsModel.getItem(id);
  if (item) {
    basketModel.removeItem(item);
    modal.close();
  }
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
  orderForm.errors = ''; 
  modal.render({ content: orderForm.render() });
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
  const errors = buyerModel.validate(['payment', 'address']);

  if (Object.keys(errors).length === 0) {
    modal.render({
      content: contactsForm.render()
    });
  } else {
    orderForm.errors = Object.values(errors).join(', ');
  }
});

events.on('contacts:submit', async () => {
  const errors = buyerModel.validate(['email', 'phone']);
  if (Object.keys(errors).length > 0) {
    contactsForm.errors = Object.values(errors).join(', ');
    return;
  }

  const order: IOrderRequest = {
    ...buyerModel.getData(),
    items: basketModel.getItems().map(i => i.id),
    total: basketModel.getTotalPrice()
  };

  try {
    const response = await weblarekApi.createOrder(order);

    const success = new Success(
      cloneTemplate('#success'),
      events
    );

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
  })
  .catch(console.error);