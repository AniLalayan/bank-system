import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {ApiService} from '../services/api.service';
import {exhaustMap, take} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const apiService = inject(ApiService);
  // return apiService.token.pipe(
  //   take(1),
  //   exhaustMap(authToken => {
  //     if (!authToken) {
  //       return next(req);
  //     }
  //     const headers = new HttpHeaders({
  //       'Authorization': `${authToken}`
  //     });
  //     const reqWithToken: any = req.clone({headers});
  //     return next(reqWithToken);
  //   }))

  const token = localStorage.getItem('token');
  if (!token) {
    return next(req);
  }
  const headers = new HttpHeaders({
    'Authorization': `${token}`
  });
  const reqWithToken: any = req.clone({headers});
  return next(reqWithToken);
}
