import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrmModule } from './crm/crm.module';
import { PropertyRadarModule } from './property-radar/property-radar.module';
import { WebhookModule } from './webhook/webhook.module';
import { OAuthController } from './oauth/oauth.controller';
import { WorkflowManagerService } from './workflow-manager/workflow-manager.service';

@Module({
  imports: [CrmModule, PropertyRadarModule, WebhookModule],
  controllers: [AppController, OAuthController],
  providers: [AppService, WorkflowManagerService],
})
export class AppModule {}
