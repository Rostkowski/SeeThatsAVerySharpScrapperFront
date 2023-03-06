import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScrappedDataResponse } from './models/scarp-models';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ScrapDataRequest } from './models/scarp-models';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class ScrapService {
  constructor(private httpClient: HttpClient) {}

  scrapData(
    data: ScrapDataRequest
  ): Observable<HttpResponse<ScrappedDataResponse>> {
    return this.httpClient.post<ScrappedDataResponse>(
      `${environment.API_BASE_URL}Scrap/ScrapWebsites/`,
      data,
      { observe: 'response' }
    );
  }
}
