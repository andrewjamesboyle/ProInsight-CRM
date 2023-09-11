import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { PropertyRadarService } from '../property-radar/property-radar.service';
import { ContactCreateDto } from 'src/contact-create.dto';
import { switchMap } from 'rxjs';

@Injectable()
export class WebhookService {
  constructor(
    private crmService: CrmService,
    private propertyRadarService: PropertyRadarService,
  ) {}

  handleContactCreatedEvent(contact: ContactCreateDto, apiToken: string) {
    this.crmService.extractContactDetails(contact)
      .pipe(
        switchMap(contactDetails => {
          return this.propertyRadarService.fetchPropertyDetails(contactDetails);
        }),
        switchMap(propertyDetails => {
          const updatedContactDetails =
            /* TO DO: Add logic to transform propertyDetails and contacts */
          return this.crmService.updateContacts(apiToken, updatedContactDetails);
        }),
      )
      .subscribe({
        next: () => console.log('Successfully processed contact'),
        error: (err) => console.error('An error occurred:', err),
      });
  }
}
