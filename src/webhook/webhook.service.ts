import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { PropertyRadarService } from '../property-radar/property-radar.service';

@Injectable()
export class WebhookService {
  constructor(
    private crmService: CrmService,
    private propertyRadarService: PropertyRadarService,
  ) {}

  async handleWebhookEvent(apiToken: string) {
    const contacts = await this.crmService.fetchContacts(apiToken).toPromise();

    const propertyDetails = await this.propertyRadarService
      .fetchPropertyDetails(contacts)
      .toPromise();

    const updatedContacts =
      /* logic to transform propertyDetails and contacts */

      await this.crmService
        .updateContacts(apiToken, updatedContacts)
        .toPromise();
  }
}
