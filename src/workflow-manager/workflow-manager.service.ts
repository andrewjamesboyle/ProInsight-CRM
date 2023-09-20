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
      const propertyDetails =
        await this.propertyRadarService.fetchPropertyDetails(contactDetails);
      console.log('Fetched property details: ', propertyDetails);

      // Merge PR data to enrich Contact Custom Fields
      console.log('Updating Contact Property Details...');
      const contactCustomFields = this.mapPrDataToCrm(propertyDetails);
      const updatedContactDetails = this.buildUpsertContactObject(
        contactCustomFields,
        contactDetails,
      );
      await this.crmService.updateContacts(updatedContactDetails);
    } catch (error) {
      throw new Error(`Workflow failed: ${error.message}`);
    }
  }

  private mapPrDataToCrm(propertyDetails: any) {
    const numberOfPropertiesOwned = propertyDetails.results.length;
    const totalEstimatedValue = propertyDetails.results.reduce(
      (acc: number, curr: any) => acc + curr.AVM,
      0,
    );
    const totalAvailableEquity = propertyDetails.results.reduce(
      (acc: number, curr: any) => acc + curr.AvailableEquity,
      0,
    );

    return [
      {
        key: 'number_of_properties_owned',
        field_value: numberOfPropertiesOwned.toString(),
      },
      {
        key: 'owners_total_value_of_properties',
        field_value: totalEstimatedValue.toString(),
      },
      {
        key: 'total_estimated_equity',
        field_value: totalAvailableEquity.toString(),
      },
    ];
  }

  private buildUpsertContactObject(
    contactCustomFields: any,
    contactDetails: any,
  ) {
    const enrichedContact = {
      ...contactDetails,
      customFields: contactCustomFields,
    };

    return {
      enrichedContact,
    };
  }
}
