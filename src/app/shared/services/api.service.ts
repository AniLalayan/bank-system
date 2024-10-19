import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, combineLatest, Observable, of} from 'rxjs';
import {CountryCodeModel} from '../models/country-code.model';
import {ResponseModel} from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  public checkPhone(username: string): Observable<ResponseModel<any>> {
    const body = { username };
    return this.http.post<any>(`${this.apiUrl}/checkPhone`, body);
  }

  public getCountryCodes(): Observable<ResponseModel<CountryCodeModel[]>> {
    return this.http.get<any>(`${this.apiUrl}/GetCountryCode`);
  }

  public getUserData(headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserData`, { headers })
      .pipe(catchError(err => of({ error: true, message: 'Failed to fetch user data' })));
  }

  public getBankAccounts(headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getBankAccounts`, { headers })
      .pipe(catchError(err => of({ error: true, message: 'Failed to fetch bank accounts' })));
  }

  public getAdditionalData(headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAdditionalData`, { headers })
      .pipe(catchError(err => of({ error: true, message: 'Failed to fetch additional data' })));
  }

  public getTransactions(headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getTransactions`, { headers })
      .pipe(catchError(err => of({ error: true, message: 'Failed to fetch transactions' })));
  }

  public fetchAllData(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    const userData$ = this.getUserData(headers);
    const bankAccounts$ = this.getBankAccounts(headers);
    const additionalData$ = this.getAdditionalData(headers);
    const transactions$ = this.getTransactions(headers);

    return combineLatest([userData$, bankAccounts$, additionalData$, transactions$]);
  }
}
