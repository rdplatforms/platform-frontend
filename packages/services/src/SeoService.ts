import type { SeoConfig } from '@rdplatforms/types';
import { jsonDataSource } from './dataSource/JsonDataSource';
import type { SeoDataSource } from './dataSource/types';

export class SeoService {
  constructor(private readonly dataSource: SeoDataSource) {}

  getByBusiness(businessId: string): Promise<SeoConfig | undefined> {
    return this.dataSource.getSeoByBusiness(businessId);
  }
}

export const seoService = new SeoService(jsonDataSource);
