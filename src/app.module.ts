import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrmModule } from './crm/crm.module';
import { PropertyRadarModule } from './property-radar/property-radar.module';
import { WebhookModule } from './webhook/webhook.module';
import { OauthController } from './oauth/oauth.controller';

@Module({
  imports: [CrmModule, PropertyRadarModule, WebhookModule],
  controllers: [AppController, OauthController],
  providers: [AppService],
})
export class AppModule {}
