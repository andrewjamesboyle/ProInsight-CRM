import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { PropertyRadarService } from '../property-radar/property-radar.service';
import { ContactCreateDto } from 'src/contact-create.dto';
// import { WorkflowManagerService } from 'src/workflow-manager/workflow-manager.service';

@Injectable()
export class WebhookService {
  constructor(
    private crmService: CrmService,
    private propertyRadarService: PropertyRadarService,
  ) {}

  async handleContactCreatedEvent(contact: ContactCreateDto) {
    try {
      console.log('Received new contact: ', contact);

      // Create a new instance of WorkflowManagerService
      // const workflowManager = new WorkflowManagerService(
      //   this.crmService,
      //   this.propertyRadarService,
      // );

      // Start the workflow
      // await workflowManager.startWorkflow(contact);
      // console.log('Successfully processed contact');
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }
}
