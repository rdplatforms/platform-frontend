import type { PageConfig, SectionConfig } from '@rdplatforms/types';
import { jsonDataSource } from './dataSource/JsonDataSource';
import type { PageDataSource } from './dataSource/types';

export class PageService {
  constructor(private readonly dataSource: PageDataSource) {}

  getAllByBusiness(businessId: string): Promise<PageConfig[]> {
    return this.dataSource.listPagesByBusiness(businessId);
  }

  getByBusinessAndPath(businessId: string, path: string): Promise<PageConfig | undefined> {
    return this.dataSource.getPageByBusinessAndPath(businessId, path);
  }

  async getEnabledSections(businessId: string, path: string): Promise<SectionConfig[]> {
    const page = await this.dataSource.getPageByBusinessAndPath(businessId, path);
    if (!page) {
      return [];
    }
    return page.sections.filter((section) => section.enabled).sort((a, b) => a.order - b.order);
  }
}

export const pageService = new PageService(jsonDataSource);
