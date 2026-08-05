import type { BusinessSettings } from '@rdplatforms/types';
import { jsonDataSource } from './dataSource/JsonDataSource';
import type { SettingsDataSource } from './dataSource/types';

export class SettingsService {
  constructor(private readonly dataSource: SettingsDataSource) {}

  getByBusiness(businessId: string): Promise<BusinessSettings | undefined> {
    return this.dataSource.getSettingsByBusiness(businessId);
  }
}

export const settingsService = new SettingsService(jsonDataSource);
