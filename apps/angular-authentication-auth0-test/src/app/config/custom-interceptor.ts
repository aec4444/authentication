import { GafAuth0InterceptorSettings, GafAuth0Service } from '@gaf/angular-authentication-auth0';
import { HttpRequest } from '@angular/common/http';
import { ROOF_PROJECT_CONFIG } from '../../environments/environment';

export class CustomInterceptorDefinition extends GafAuth0InterceptorSettings {
    AddCustomHeaders(req: HttpRequest<any>, authService: GafAuth0Service): {
        [name: string]: string | string[];
    } {
        const headers = super.AddCustomHeaders(req, authService);

        if (req.url.toLowerCase().startsWith(ROOF_PROJECT_CONFIG.baseUrl.toLowerCase())) {
            headers['client_id'] = '6ac9dfc0606f41528549c36a7d8f704a';
            headers['client_secret'] = 'b4af1add128145ca88A185BA95AF9EF0';
        }

        return headers;
    }
}

export const customInterceptor = new CustomInterceptorDefinition();
