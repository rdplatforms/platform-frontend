import type { NewSaleEntry, SaleEntry } from '@rdplatforms/types';
import { localStorageSalesDataSource } from './dataSource/LocalStorageDataSource';
import type { SalesDataSource } from './dataSource/types';

export class SalesService {
  constructor(private readonly dataSource: SalesDataSource) {}

  getByBusiness(businessId: string): Promise<SaleEntry[]> {
    return this.dataSource.listSalesByBusiness(businessId);
  }

  create(entry: NewSaleEntry): Promise<SaleEntry> {
    return this.dataSource.createSale(entry);
  }

  remove(id: string, businessId: string): Promise<void> {
    return this.dataSource.deleteSale(id, businessId);
  }
}

export const salesService = new SalesService(localStorageSalesDataSource);
