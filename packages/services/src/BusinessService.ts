import type { Business } from '@rdplatforms/types';
import { activeDataSource } from './dataSource/activeDataSource';
import type { BusinessDataSource } from './dataSource/types';

export class BusinessService {
  constructor(private readonly dataSource: BusinessDataSource) {}

  getAll(): Promise<Business[]> {
    return this.dataSource.listBusinesses();
  }

  getBySlug(slug: string): Promise<Business | undefined> {
    return this.dataSource.getBusinessBySlug(slug);
  }
}

export const businessService = new BusinessService(activeDataSource);
