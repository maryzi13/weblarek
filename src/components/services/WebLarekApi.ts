import { IApi } from '../../types';
import { IProduct, IProductsResponse, IOrderRequest, IOrderResponse } from '../../types';

export class WebLarekApi {
  constructor(private api: IApi) {}

  async getProducts(): Promise<IProduct[]> {
    const data = await this.api.get<IProductsResponse>('/product/');
    return data.items;
  }

  async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    const data = await this.api.post<IOrderResponse>('/order/', order);
    return data;
  }
}