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
          tokenExpiry: response.expires_in,
        };
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Error obtaining access token:', error);
      throw error;
    }
  }

  async refreshToken(
    refreshToken: string,
    locationId: string,
  ): Promise<string> {
    try {
      const observable = this.httpService.post(
        'https://api.gohighlevel.com/OAuth/token',
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );

      const response = await firstValueFrom(
        observable.pipe(map((axiosResponse) => axiosResponse.data)),
      );

      if (response && response.access_token) {
        // store new token in database
        await this.supabaseService.updateRecord(
          'oauth_tokens',
          {
            access_token: response.access_token,
            token_expiry: response.expires_in,
          },
          locationId,
        );

        return response.access_token;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  async getToken(locationId: string): Promise<string> {
    const tokenIsExpired =
      await this.supabaseService.isTokenExpired(locationId);

    if (tokenIsExpired) {
      const refreshToken =
        await this.supabaseService.fetchRefreshToken(locationId);
      const freshToken = await this.refreshToken(refreshToken, locationId);

      // Update the new token and its expiration time back to the database
      // You could also do this inside the refreshToken() method
      await this.supabaseService.addRecord('oauth_tokens', {
        location_id: locationId,
        access_token: freshToken,
        // Add other fields like refresh_token and token_expiry
      });

      return freshToken;
    } else {
      // Fetch and return the existing, non-expired token from the database
      return await this.supabaseService.fetchCurrentToken(locationId);
    }
  }
}
