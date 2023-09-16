import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { HttpModule } from '@nestjs/axios';
import { CrmModule } from 'src/crm/crm.module';
import { PropertyRadarModule } from 'src/property-radar/property-radar.module';

@Module({
  imports: [HttpModule, CrmModule, PropertyRadarModule],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
