import { Controller, Get, Query, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';
import { OAuthService } from './oauth.service';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly httpService: HttpService,
    private readonly oAuthService: OAuthService,
  ) {}

  @Get('hello')
  sayHello(): string {
    return 'Hello World!';
  }

  @Get('callback')
  async handleOAuthCallback(@Query('code') code: string, @Res() res: Response) {
    console.log('Entering OAuth Callback with code:', code);

    // Exchange code for access token
    const accessTokenData = await this.oAuthService.handleCallback(code);

    // Extract the access token, refresh token, and location ID
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      location_id: locationId,
      token_expiry: tokenExpiry,
    } = accessTokenData;

    await this.supabaseService.addRecord('oauth_tokens', {
      location_id: locationId,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expiry: tokenExpiry,
    });

    // Redirect the user to their dashboard on Go High Level
    const redirectUrl = `https://crm.proinsight.us/v2/location/${locationId}/dashboard`;
    res.redirect(redirectUrl);
  }
}
