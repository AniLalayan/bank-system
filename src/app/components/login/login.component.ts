import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {ResponseModel} from '../../shared/models/response.model';
import {CountryCodeModel} from '../../shared/models/country-code.model';
import {Router} from '@angular/router';
import {SUCCESS_MESSAGE} from '../../shared/constants';
import {LanguageSwitcherComponent} from '../../shared/components/language-switcher/language-switcher.component';
import {TranslateModule} from '@ngx-translate/core';
import {ClickOutsideDirective} from '../../shared/directives/click-outside.directive';
import {Subject, takeUntil, throwError} from 'rxjs';
import {DropdownComponent} from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, LanguageSwitcherComponent, TranslateModule, ClickOutsideDirective, DropdownComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public countryCodes: CountryCodeModel[] = [];
  public selectedCode: string = '';
  public selectedItemIndex: number = 0;
  public isPhoneChecked = false;
  public isSelectBoxOpened = false
  public showValidationMessages = false;
  public requestErrorMessage = '';
  public isDropdownDisabled = false;
  private destroy$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private router: Router,
              private cdr: ChangeDetectorRef) {
    this.form = this.formBuilder.group({
      code: ['+374', Validators.required],
      number: [null, [Validators.required, Validators.pattern(/^\d{8}$/)]],
      password: ['', Validators.required]
    })
  }

  public ngOnInit(): void {
    this.apiService.getCountryCodes().pipe(
      takeUntil(this.destroy$))
      .subscribe({
      next: (response: ResponseModel<CountryCodeModel[]>) => {
        this.countryCodes = response.result.map(country => ({
          countryCode: country.countryCode,
          countryName: country.countryName
        }));
        this.getSelectedItemIndex();
        this.cdr.detectChanges();
      },
      error: err => throwError(err),
    });
  }

  public submit(): void {
    this.checkFormValidation();
    if (!this.form.invalid) {
      const username = `${parseInt(this.form.controls['code'].value)}${this.form.controls['number'].value}`;
      !this.isPhoneChecked ? this.checkPhoneNumber(username) : this.login(username);
    }
  }

  public checkPhoneNumber(username: string) {
    this.apiService.checkPhone(username).pipe(
      takeUntil(this.destroy$))
      .subscribe({
      next: (response: ResponseModel<CountryCodeModel[]>) => {
        if (response.message === SUCCESS_MESSAGE) {
          this.isPhoneChecked = true;
          this.form.controls['number'].disable();
          this.form.controls['code'].disable();
          this.isDropdownDisabled = true;
          this.requestErrorMessage = '';
        }
      },
      error: err => {
        this.requestErrorMessage = err.error.message;
        this.cdr.detectChanges();
        throwError(err);
      },
    });
  }

  public login(username: string) {
    this.apiService.login(username, this.form.controls['password'].value).pipe(
      takeUntil(this.destroy$))
      .subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        this.requestErrorMessage = '';
        this.router.navigateByUrl('/system');
      },
      error: err => {
        this.requestErrorMessage = err.error.message;
        throwError(err)
        this.cdr.detectChanges();
      },
    });
  }

  private checkFormValidation() {
    if (!this.isPhoneChecked) {
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].updateValueAndValidity();
      if (this.form.controls['code'].invalid || this.form.controls['number'].invalid) {
        this.form.controls['code'].markAsTouched();
        this.form.controls['number'].markAsTouched();
        this.showValidationMessages = true;
        return;
      }
      this.showValidationMessages = false;
    } else {
      this.form.controls['password'].setValidators([Validators.required]);
      this.form.controls['password'].updateValueAndValidity();
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.showValidationMessages = true;
        return;
      }
      this.showValidationMessages = false;
    }
  }

  public onItemSelected(countryCode: CountryCodeModel) {
    this.form.controls['code'].setValue(`+${countryCode.countryCode}`);
  }

  public getSelectedItemIndex() {
    const value = parseInt(this.form.controls['code'].value);
    this.selectedItemIndex = this.countryCodes.findIndex((item: CountryCodeModel) => item.countryCode === value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
