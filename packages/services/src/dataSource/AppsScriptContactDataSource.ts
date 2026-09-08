import type { ContactMessageDetails } from '@rdplatforms/utils';
import { postToAppsScript } from './AppsScriptClient';
import type { ContactDataSource } from './types';

export interface AppsScriptContactDataSourceOptions {
  /** The business's own Apps Script Web App "exec" URL — same deployment the booking data source posts to, see integrations/apps-script/README.md. */
  webAppUrl: string;
  fetchImpl?: typeof fetch;
}

export class AppsScriptContactDataSource implements ContactDataSource {
  constructor(private readonly options: AppsScriptContactDataSourceOptions) {}

  async createContactMessage(businessId: string, message: ContactMessageDetails): Promise<void> {
    await postToAppsScript(
      this.options.webAppUrl,
      { type: 'contact', businessId, ...message },
      this.options.fetchImpl,
    );
  }
}
