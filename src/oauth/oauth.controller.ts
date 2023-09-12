import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('oauth')
export class OAuthController {
  @Get('callback')
  async handleOAuthCallback(@Query('code') code: string, @Res() res: Response) {
    // Here, 'code' is the authorization code you get from Go High Level
    // Use this code to get an access token
    // Your OAuth 2.0 logic here
    const locationId = await this.getLocationId(code);
    // Assuming you successfully obtain an access token and validate it...

    // Redirect to the main CRM page
    res.redirect(
      `https://crm.proinsight.us/v2/location/${locationId}/dashboard`,
    );
  }
}
