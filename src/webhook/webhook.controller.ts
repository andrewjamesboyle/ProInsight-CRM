import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('handle')
  async handleWebhook(@Body() body: any) {
    const apiToken = body.apiToken;
    await this.webhookService.handleWebhookEvent(apiToken);
    return { message: 'Webhook processed successfully!' };
  }
}
