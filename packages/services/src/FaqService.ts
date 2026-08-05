import type { FaqItem } from '@rdplatforms/types';
import { jsonDataSource } from './dataSource/JsonDataSource';
import type { FaqDataSource } from './dataSource/types';

export class FaqService {
  constructor(private readonly dataSource: FaqDataSource) {}

  getByBusiness(businessId: string): Promise<FaqItem[]> {
    return this.dataSource.listFaqsByBusiness(businessId);
  }
}

export const faqService = new FaqService(jsonDataSource);
