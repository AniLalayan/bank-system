import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {Router} from '@angular/router';
import {BankAccountModel} from '../../shared/models/bank-account.model';
import {UserDataModel} from '../../shared/models/user-data.model';
import {NgClass, UpperCasePipe} from '@angular/common';
import {AuthService} from '../../shared/services/auth.service';
import {headerMenuItems} from '../../shared/constants';
import {LanguageSwitcherComponent} from '../../shared/components/language-switcher/language-switcher.component';
import {TranslateModule} from '@ngx-translate/core';
import {BankAccountsComponent} from '../bank-accounts/bank-accounts.component';
import {ClickOutsideDirective} from '../../shared/directives/click-outside.directive';
import {Subject, takeUntil, throwError} from 'rxjs';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [UpperCasePipe, NgClass, LanguageSwitcherComponent, TranslateModule, BankAccountsComponent, ClickOutsideDirective],
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

  public dropDownMenuIconUrl = 'assets/icons/custom-select/arrow-down-light.svg';
  public isDropdownOpened = false;
  public headerMenuItems = headerMenuItems;

  constructor(private apiService: ApiService,
              private router: Router,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) {}

  public ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchData(token);
    } else {
      this.router.navigateByUrl('/login');
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

  toggleDropdown() {
    this.isDropdownOpened = !this.isDropdownOpened;
    this.dropDownMenuIconUrl = this.isDropdownOpened ? 'assets/icons/custom-select/arrow-up-light.svg' : 'assets/icons/custom-select/arrow-down-light.svg';
  }

  public logout() {
    this.authService.logout();
  }

  public closeSelectBox(): void {
    if (this.isDropdownOpened) {
      this.isDropdownOpened = false;
      this.dropDownMenuIconUrl = 'assets/icons/custom-select/arrow-down-light.svg';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
