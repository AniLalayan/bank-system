import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, catchError, combineLatest, Observable, of, Subject, tap} from 'rxjs';
import {CountryCodeModel} from '../models/country-code.model';
import {ResponseModel} from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'http://localhost:3000';
  // public token = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  public login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body)
    //   .pipe(tap((res) => {
    //   this.token.next(res.token);
    // }));
  }

  public checkPhone(username: string): Observable<ResponseModel<any>> {
    const body = { username };
    return this.http.post<any>(`${this.apiUrl}/checkPhone`, body);
  }

  public getCountryCodes(): Observable<ResponseModel<CountryCodeModel[]>> {
    return this.http.get<any>(`${this.apiUrl}/GetCountryCode`);
  }

  public getUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserData`, )
      .pipe(catchError(err => of({ error: true, message: 'Failed to fetch user data' })));
  }

  public getBankAccounts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getBankAccounts`)
      .pipe(catchError(err => of({ error: true, message: 'Failed to fetch bank accounts' })));
  }

  public getAdditionalData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAdditionalData`)
      .pipe(catchError(err => of({ error: true, message: 'Failed to fetch additional data' })));
  }

  public getTransactions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getTransactions`)
      .pipe(catchError(err => of({ error: true, message: 'Failed to fetch transactions' })));
  }

  public fetchAllData(): Observable<any> {
    const userData$ = this.getUserData();
    const bankAccounts$ = this.getBankAccounts();
    const additionalData$ = this.getAdditionalData();
    const transactions$ = this.getTransactions();

    return combineLatest([userData$, bankAccounts$, additionalData$, transactions$]);
  }
}
