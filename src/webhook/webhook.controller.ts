import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ContactCreateDto } from 'src/contact-create.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('contact-created')
  handleContactCreated(@Body() contact: ContactCreateDto) {
    return this.webhookService.handleContactCreatedEvent(contact, 'API_TOKEN');
  }
  // @Post('handle')
  // async handleWebhook(@Body() body: any) {
  //   const apiToken = body.apiToken;
  //   await this.webhookService.handleWebhookEvent(apiToken);
  //   return { message: 'Webhook processed successfully!' };
  // }
}
