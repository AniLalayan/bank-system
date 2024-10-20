import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {BankAccountModel} from '../../shared/models/bank-account.model';
import {TranslateModule} from '@ngx-translate/core';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  imports: [TranslateModule, UpperCasePipe],
  templateUrl: './bank-accounts.component.html',
  styleUrl: './bank-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankAccountsComponent implements OnInit {

  @Input() public bankAccounts: BankAccountModel[] = [];
  public showAccountNumbers: boolean[] = [];
  public showAccountBalances: boolean[] = [];

  constructor() {}

  public ngOnInit() {
    this.bankAccounts?.forEach(() => this.showAccountNumbers.push(false));
    this.bankAccounts?.forEach(() => this.showAccountBalances.push(false));
  }

  public toggleAccountNumberVisibility(index: number): void {
    this.showAccountNumbers[index] = !this.showAccountNumbers[index];
  }

  public toggleAccountBalanceVisibility(index: number): void {
    this.showAccountBalances[index] = !this.showAccountBalances[index];
  }

}
