import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import {sourcetypeMdl} from '../Models/sourcetype'
@Injectable({
  providedIn: 'root'
})
export class SourcetypeService {

  private endpointSourcetype = 'apiSourceType';
  private apiService: string | undefined;

  constructor(private http: HttpClient) { this.apiService = environment.apiService; }


  getSourcetype(): Observable<sourcetypeMdl[]> {
    console.log('services');
    return this.http
      .get(`${this.apiService}${this.endpointSourcetype}`)
      .pipe(
        map((data: any) => data),

      )
  }
}

