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
import { IBuyer } from './types';

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

events.on('products:changed', () => {
  const items = productsModel.getItems();

  const cards = items.map((item) => {
    const card = new CatalogCard(
      cloneTemplate('#card-catalog'),
      {
        onClick: () => {
          const full = productsModel.getItem(item.id);
          if (full) productsModel.setPreview(full);
        }
      }
    );

    return card.render({
      ...item,
      image: CDN_URL + item.image
    });
  });

  gallery.render({ catalog: cards });
});

events.on('preview:changed', (item: IProduct) => {
  const preview = new PreviewCard(
    cloneTemplate('#card-preview'),
    {
      onButtonClick: () => {
        if (basketModel.hasItem(item.id)) {
          basketModel.removeItem(item);
        } else {
          basketModel.addItem(item);
        }
        modal.close();
      }
    }
  );

  modal.render({
    content: preview.render({
      ...item,
      image: CDN_URL + item.image,
      buttonText: basketModel.hasItem(item.id)
        ? 'Удалить из корзины'
        : 'В корзину',
      buttonDisabled: item.price === null
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
      {
        onDelete: () => basketModel.removeItem(item)
      }
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

events.on('basket:open', () => {
  modal.render({
    content: basketView.render()
  });
});

events.on('order:open', () => {
  if (basketModel.getItems().length === 0) {
    return;
  }

  const orderForm = new OrderForm(
  cloneTemplate('#order'),
  {
    onChange: (field: keyof IBuyer, value: string) => {
      buyerModel.setData({ [field]: value });

        const errors = buyerModel.validate(['payment', 'address']);

        orderForm.valid = Object.keys(errors).length === 0;
        orderForm.errors = errors.address || errors.payment || '';
      },
      onSubmit: () => {
        events.emit('order:submit');
      }
    }
  );

  modal.render({
    content: orderForm.render({
      ...buyerModel.getData()
    })
  });

  const errors = buyerModel.validate(['payment', 'address']);
  orderForm.valid = Object.keys(errors).length === 0;
  orderForm.errors = errors.address || errors.payment || '';
});

events.on('order:submit', () => {
  const contactsForm = new ContactsForm(
    cloneTemplate('#contacts'),
    {
      onChange: (field: keyof IBuyer, value: string) => {
        buyerModel.setData({ [field]: value });

        const errors = buyerModel.validate(['email', 'phone']);
        contactsForm.valid = Object.keys(errors).length === 0;
        contactsForm.errors = Object.values(errors).join(', ');
      },
      onSubmit: async () => {
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
      }
    }
  );

  modal.render({
    content: contactsForm.render({
      ...buyerModel.getData()
    })
  });

  const errors = buyerModel.validate(['email', 'phone']);
  contactsForm.valid = Object.keys(errors).length === 0;
  contactsForm.errors = Object.values(errors).join(', ');
});

events.on('success:close', () => {
  modal.close();
});

weblarekApi.getProducts()
  .then((products) => {
    productsModel.setItems(products);
    events.emit('basket:changed');
  })
  .catch(console.error);

