import type { GalleryItem } from '@rdplatforms/types';
import { activeDataSource } from './dataSource/activeDataSource';
import type { GalleryDataSource } from './dataSource/types';

export class GalleryService {
  constructor(private readonly dataSource: GalleryDataSource) {}

  async getByBusiness(businessId: string): Promise<GalleryItem[]> {
    const items = await this.dataSource.listGalleryByBusiness(businessId);
    return [...items].sort((a, b) => a.order - b.order);
  }
}

export const galleryService = new GalleryService(activeDataSource);
