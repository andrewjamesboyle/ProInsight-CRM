import { PropertyRadarService } from 'src/property-radar/property-radar.service'; // Adjust the import paths as needed
import { ContactCreateDto } from 'src/contact-create.dto'; // Adjust the import paths as needed
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { CrmService } from 'src/crm/crm.service';

export class WorkflowManagerService {
  private contactDetails: any;
  private apiToken: string;
  private propertyDetails: any;

  constructor(
    private crmService: CrmService,
    private propertyRadarService: PropertyRadarService,
  ) {}

  startWorkflow(contact: ContactCreateDto): Observable<any> {
    return this.crmService.extractContactDetails(contact).pipe(
      tap((contactDetails) => {
        console.log('Extracted contact details: ', contactDetails);
        this.contactDetails = contactDetails;
        // Retrieve API token here and set this.apiToken
      }),
      switchMap(() => {
        console.log('Fetching property details...');
        return this.propertyRadarService.fetchPropertyDetails(
          this.contactDetails,
        );
      }),
      tap((propertyDetails) => {
        console.log('Fetched property details: ', propertyDetails);
        this.propertyDetails = propertyDetails;
      }),
      switchMap(() => {
        console.log('Updating Contact Property Details...');
        const updatedContactDetails = this.mergeContactAndPropertyDetails(
          this.contactDetails,
          this.propertyDetails,
        );
        return this.crmService.updateContacts(
          this.apiToken,
          updatedContactDetails,
        );
      }),
    );
  }

  private mergeContactAndPropertyDetails(
    contactDetails: any,
    propertyDetails: any,
  ): any {
    // Your logic to merge contactDetails and propertyDetails goes here.
    // This could be as simple or as complex as needed.
    // For demonstration, returning the merged object:
    return { ...contactDetails, ...propertyDetails };
  }
}
