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
        // Retrieve API token here and set this.apiToken
      }),
      switchMap((contactDetails) => {
        console.log('Fetching property details...');
        return this.propertyRadarService.fetchPropertyDetails(contactDetails);
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
    // TO DO: add logic to merge contactDetails and propertyDetails here.
    // I need to add the LocationId to the propertyDetails object
    // return the merged object:
    return { ...contactDetails, ...propertyDetails };
  }
}
