export class ContactCreateDto {
  type: string;
  locationId: string;
  id: string;
  address1: string;
  city: string;
  state: string;
  companyName: string;
  country: string;
  source: string;
  dateAdded: string;
  dateOfBirth: string;
  dnd: boolean;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  tags: string[];
  website: string;
  attachments: any[];
  assignedTo: string;
}
