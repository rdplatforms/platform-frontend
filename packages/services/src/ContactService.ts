import type { ContactMessageDetails } from '@rdplatforms/utils';
import { AppsScriptContactDataSource } from './dataSource/AppsScriptContactDataSource';
import type { ContactDataSource } from './dataSource/types';

// Same local-cast reasoning as activeDataSource.ts — see that file's comment.
const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const appsScriptUrl = env?.VITE_APPS_SCRIPT_URL;

/**
 * No Tier 3 branch yet, unlike BookingService — platform-backend has no
 * ContactMessage entity (see ContactDataSource's own comment). Add a
 * VITE_API_BASE_URL branch here once/if that's built; until then a
 * Tier 3 deployment falls through to undefined, same as Tier 1.
 */
const contactDataSource: ContactDataSource | undefined = appsScriptUrl
  ? new AppsScriptContactDataSource({ webAppUrl: appsScriptUrl })
  : undefined;

/**
 * Best-effort, same reasoning as BookingService: the Contact section's
 * WhatsApp handoff must never be blocked by a failed/skipped backend
 * save.
 */
export class ContactService {
  constructor(private readonly dataSource: ContactDataSource | undefined) {}

  async createContactMessage(businessId: string, message: ContactMessageDetails): Promise<void> {
    if (!this.dataSource) {
      return;
    }
    await this.dataSource.createContactMessage(businessId, message);
  }
}

export const contactService = new ContactService(contactDataSource);
