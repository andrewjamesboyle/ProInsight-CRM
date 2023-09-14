import { PropertyRadarService } from 'src/property-radar/property-radar.service'; // Adjust the import paths as needed
import { ContactCreateDto } from 'src/contact-create.dto'; // Adjust the import paths as needed
import { CrmService } from 'src/crm/crm.service';

export class WorkflowManagerService {
  constructor(
    private crmService: CrmService,
    private propertyRadarService: PropertyRadarService,
  ) {}

  async startWorkflow(contact: ContactCreateDto) {
    try {
      // Extract Contact Details
      const contactDetails =
        await this.crmService.extractContactDetails(contact);
      console.log('Extracted contact details: ', contactDetails);

      // Fetch Property Details
      console.log('Fetching property details...');
      const propertyDetails =
        await this.propertyRadarService.fetchPropertyDetails(contactDetails);
      console.log('Fetched property details: ', propertyDetails);

      // Merge and Update Contact
      console.log('Updating Contact Property Details...');
      const updatedContactDetails = this.mergeContactAndPropertyDetails(
        contactDetails,
        propertyDetails,
      );
      await this.crmService.updateContacts(updatedContactDetails);
    } catch (error) {
      throw new Error(`Workflow failed: ${error.message}`);
    }
  }

  private mergeContactAndPropertyDetails(
    contactDetails: any,
    propertyDetails: any,
  ): any {
    // TO DO: add logic to merge contactDetails and propertyDetails here.
    // I need to add the LocationId to the propertyDetails object
    // return the merged object:
    return { ...contactDetails, ...propertyDetails };
  }
}
