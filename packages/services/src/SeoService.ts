import type { SeoConfig } from '@rdplatforms/types';
import { activeDataSource } from './dataSource/activeDataSource';
import type { SeoDataSource } from './dataSource/types';

export class SeoService {
  constructor(private readonly dataSource: SeoDataSource) {}

  getByBusiness(businessId: string): Promise<SeoConfig | undefined> {
    return this.dataSource.getSeoByBusiness(businessId);
  }
}

export const seoService = new SeoService(activeDataSource);
