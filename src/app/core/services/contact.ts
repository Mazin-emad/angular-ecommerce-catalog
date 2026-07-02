import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http = inject(HttpClient);

  private readonly url = environment.web3forms.url;

  private readonly accessKey = environment.web3forms.accessKey;

  send(data: ContactFormData): Promise<Web3FormsResponse> {
    return firstValueFrom(
      this.http.post<Web3FormsResponse>(this.url, {
        access_key: this.accessKey,
        ...data,
      }),
    );
  }
}
