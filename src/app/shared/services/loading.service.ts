import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading$ = new BehaviorSubject<boolean>(false);
  private activeRequests = 0;

  showLoading() {
    this.activeRequests++;
    this.loading$.next(true);
  }

  hideLoading() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.loading$.next(false);
    }
  }
}
