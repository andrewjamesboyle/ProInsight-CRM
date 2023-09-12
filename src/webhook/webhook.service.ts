import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { PropertyRadarService } from '../property-radar/property-radar.service';
import { ContactCreateDto } from 'src/contact-create.dto';
import { switchMap, tap } from 'rxjs';

@Injectable()
export class WebhookService {
  constructor(
    private crmService: CrmService,
    private propertyRadarService: PropertyRadarService,
  ) {}

  handleContactCreatedEvent(contact: ContactCreateDto) {
    console.log('Received new contact: ', contact);

    this.crmService.extractContactDetails(contact)
      .pipe(
        tap(contactDetails => console.log('Extracted contact details: ', contactDetails)),
        switchMap(contactDetails => {
          console.log('Fetching property details...');
          return this.propertyRadarService.fetchPropertyDetails(contactDetails);
        }),
        tap(propertyDetails => console.log('Fetched property details: ', propertyDetails)),
        switchMap(propertyDetails => {
          const updatedContactDetails =
            /* TO DO: Add logic to transform propertyDetails and contacts */
          return this.crmService.updateContacts(updatedContactDetails);
        }),
      )
      .subscribe({
        next: () => console.log('Successfully processed contact'),
        error: (err) => console.error('An error occurred:', err),
      });
  }
}
