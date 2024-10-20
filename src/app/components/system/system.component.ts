import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [UpperCasePipe, NgClass, LanguageSwitcherComponent, TranslateModule, BankAccountsComponent, ClickOutsideDirective],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent implements OnInit {

  public userData!: UserDataModel;
  public bankAccounts: BankAccountModel[] = [];
  public additionalData!: {description: string};
  public transactions!: any;

  public dropDownMenuIconUrl = 'assets/icons/custom-select/arrow-down-light.svg';
  public isDropdownOpened = false;
  public headerMenuItems = headerMenuItems;

  constructor(private apiService: ApiService,
              private router: Router,
              private authService: AuthService) {}

  public ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchData(token);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public fetchData(token: string) {
    this.apiService.fetchAllData(token).subscribe(results => {
      this.userData = results[0].result;
      this.bankAccounts = results[1].result;
      this.additionalData = results[2].result;
      this.transactions = results[3].result;
      this.handleErrors();
    });
  }

  private handleErrors() {
    // if (this.userData?.error) {
    //   console.error(this.userData.message);
    // }
    // if (this.bankAccounts?.error) {
    //   console.error(this.bankAccounts.message);
    // }
    // if (this.additionalData?.error) {
    //   console.error(this.additionalData.message);
    // }
    // if (this.transactions?.error) {
    //   console.error(this.transactions.message);
    // }
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

}
