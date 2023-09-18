import { Controller, Get, Query, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly httpService: HttpService,
  ) {}

  @Get('callback')
  async handleOAuthCallback(@Query('code') code: string, @Res() res: Response) {
    // Exchange code for access token
    const accessTokenData = await this.getAccessToken(code);

    // Extract the access token, refresh token, and location ID
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      location_id: locationId,
    } = accessTokenData;

    await this.supabaseService.addRecord('oauth_tokens', {
      location_id: locationId,
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Redirect the user to their dashboard on Go High Level
    const redirectUrl = `https://crm.proinsight.us/v2/location/${locationId}/dashboard`;
    res.redirect(redirectUrl);
  }

  private async getAccessToken(code: string): Promise<any> {
    try {
      const observable = this.httpService.post(
        'https://api.gohighlevel.com/OAuth/token',
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          redirect_uri:
            'https://pro-insight-isb4sdtn5-andrewjamesboyle.vercel.app/oauth/callback',
          grant_type: 'authorization_code',
        },
      );

      const response = await firstValueFrom(
        observable.pipe(map((axiosResponse) => axiosResponse.data)),
      );

      if (response && response.access_token) {
        return {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          locationId: response.locationId,
        };
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Error obtaining access token:', error);
      throw error;
    }
  }
}
