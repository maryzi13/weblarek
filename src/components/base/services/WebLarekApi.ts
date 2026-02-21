import { IApi } from '../../../types';
import { IProduct, IProductsResponse, IOrderRequest, IOrderResponse } from '../../../types';

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    const data = await this.api.get('/product/');
    return (data as IProductsResponse).items;
  }

  async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    const data = await this.api.post('/order/', order);
    return data as IOrderResponse;
  }
}