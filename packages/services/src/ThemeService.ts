import type { BusinessTheme } from '@rdplatforms/types';
import { jsonDataSource } from './dataSource/JsonDataSource';
import type { ThemeDataSource } from './dataSource/types';

export class ThemeService {
  constructor(private readonly dataSource: ThemeDataSource) {}

  getByBusiness(businessId: string): Promise<BusinessTheme | undefined> {
    return this.dataSource.getThemeByBusiness(businessId);
  }
}

export const themeService = new ThemeService(jsonDataSource);
