import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ContactCreateDto } from 'src/contact-create.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('contact-created')
  handleContactCreated(@Body() contact: ContactCreateDto) {
    return this.webhookService.handleContactCreatedEvent(contact);
  }

  // TO DO: evaluate API_TOKEN parameter
}
