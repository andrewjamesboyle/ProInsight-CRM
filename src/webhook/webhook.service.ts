import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { PropertyRadarService } from '../property-radar/property-radar.service';
import { ContactCreateDto } from 'src/contact-create.dto';
import { WorkflowManagerService } from 'src/workflow-manager/workflow-manager.service';

@Injectable()
export class WebhookService {
  constructor(
    private crmService: CrmService,
    private propertyRadarService: PropertyRadarService,
  ) {}

  handleContactCreatedEvent(contact: ContactCreateDto) {
    console.log('Received new contact: ', contact);

    // Create a new instance of WorkflowManagerService
    const workflowManager = new WorkflowManagerService(
      this.crmService,
      this.propertyRadarService,
    );

    // Start the workflow
    workflowManager.startWorkflow(contact).subscribe({
      next: () => console.log('Successfully processed contact'),
      error: (err) => console.error('An error occurred:', err),
    });
  }
}

// @Injectable()
// export class WebhookService {
//   constructor(
//     private crmService: CrmService,
//     private propertyRadarService: PropertyRadarService,
//   ) {}

//   handleContactCreatedEvent(contact: ContactCreateDto) {
//     console.log('Received new contact: ', contact);

//     this.crmService
//       .extractContactDetails(contact)
//       .pipe(
//         tap((contactDetails) =>
//           console.log('Extracted contact details: ', contactDetails),
//         ),
//         switchMap((contactDetails) => {
//           console.log('Fetching property details...');
//           return this.propertyRadarService.fetchPropertyDetails(contactDetails);
//         }),
//         tap((propertyDetails) =>
//           console.log('Fetched property details: ', propertyDetails),
//         ),

//         switchMap((propertyDetails) => {
//           console.log('Updating Contact Property Details...');
//           const updatedContactDetails = this.contactPropertyMergerService.merge(
//             contactDetails,
//             propertyDetails,
//           );
//           return this.crmService.updateContacts(
//             apiToken,
//             updatedContactDetails,
//           );
//         }),
//       )
//       .subscribe({
//         next: () => console.log('Successfully processed contact'),
//         error: (err) => console.error('An error occurred:', err),
//       });
//   }
// }
