import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {Router} from '@angular/router';
import {BankAccountModel} from '../../shared/models/bank-account.model';
import {UserDataModel} from '../../shared/models/user-data.model';
import {AuthService} from '../../shared/services/auth.service';
import {TranslateModule} from '@ngx-translate/core';
import {BankAccountsComponent} from '../bank-accounts/bank-accounts.component';
import {Subject, takeUntil, throwError} from 'rxjs';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [TranslateModule, BankAccountsComponent,  HeaderComponent],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemComponent implements OnInit, OnDestroy {

  public userData!: UserDataModel;
  public bankAccounts: BankAccountModel[] = [];
  public additionalData!: any;
  public transactions!: any;
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService,
              private router: Router,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) {}

  public ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchData(token);
    } else {
      this.authService.logout();
    }
  }

  public fetchData(token: string) {
    this.apiService.fetchAllData(token).pipe(
      takeUntil(this.destroy$))
      .subscribe( {
      next: results => {
        this.userData = results[0].result;
        this.bankAccounts = results[1].result;
        this.additionalData = results[2].result;
        this.transactions = results[3].result;
        this.cdr.detectChanges();
      },
      error: err => throwError(err)
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
