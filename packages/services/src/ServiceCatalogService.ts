import type { ServiceItem } from '@rdplatforms/types';
import { jsonDataSource } from './dataSource/JsonDataSource';
import type { ServiceCatalogDataSource } from './dataSource/types';

export class ServiceCatalogService {
  constructor(private readonly dataSource: ServiceCatalogDataSource) {}

  getByBusiness(businessId: string): Promise<ServiceItem[]> {
    return this.dataSource.listServicesByBusiness(businessId);
  }

  async getFeaturedByBusiness(businessId: string): Promise<ServiceItem[]> {
    const services = await this.dataSource.listServicesByBusiness(businessId);
    return services.filter((service) => service.isFeatured);
  }
}

export const serviceCatalogService = new ServiceCatalogService(jsonDataSource);
