import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {ResponseModel} from '../../shared/models/response.model';
import {CountryCodeModel} from '../../shared/models/country-code.model';
import {Router} from '@angular/router';
import {SUCCESS_MESSAGE} from '../../shared/constants';
import {LanguageSwitcherComponent} from '../../shared/components/language-switcher/language-switcher.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ClickOutsideDirective} from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, LanguageSwitcherComponent, TranslateModule, ClickOutsideDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public countryCodes: CountryCodeModel[] = [];
  public selectedCode: string = '';
  public selectedItemIndex: number = 0;
  public isPhoneChecked = false;
  public isSelectBoxOpened = false
  public selectBoxIconUrl = 'assets/icons/custom-select/arrow-down.svg'
  public isButtonClicked = false;
  public requestErrorMessage = '';

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private router: Router,
              private translate: TranslateService) {
    this.form = this.formBuilder.group({
      code: ['+374', Validators.required],
      number: [null, [Validators.required, Validators.pattern(/^\d{8}$/)]],
      password: ['', Validators.required]
    })
  }

  public ngOnInit(): void {
    this.getSelectedItemIndex();
    this.apiService.getCountryCodes().subscribe({
      next: (response: ResponseModel<CountryCodeModel[]>) => {
        this.countryCodes = response.result.map(country => ({
          countryCode: country.countryCode,
          countryName: country.countryName
        }));
      },
      error: err => {
        console.error('Error fetching country codes:', err);
      }
    });
  }

  public onCodeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCode = selectElement.value;
    this.form.patchValue({ code: this.selectedCode });
  }

  public submit(): void {
    this.isButtonClicked = true;
    this.checkFormValidation();
    if (!this.form.invalid) {
      const username = `${parseInt(this.form.controls['code'].value)}${this.form.controls['number'].value}`;
      !this.isPhoneChecked ? this.checkPhoneNumber(username) : this.login(username);
    }
  }

  public checkPhoneNumber(username: string) {
    this.apiService.checkPhone(username).subscribe({
      next: (response: ResponseModel<CountryCodeModel[]>) => {
        if (response.message === SUCCESS_MESSAGE) {
          this.isPhoneChecked = true;
          this.form.controls['number'].disable();
        }
      },
      error: err => {
        console.error('Error fetching country codes:', err);
      }
    });
  }

  public login(username: string) {
    this.apiService.login(username, this.form.controls['password'].value).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigateByUrl('/system');
      },
      error: err => {
        console.error('Error fetching country codes:', err);
      }
    });
  }

  private checkFormValidation() {
    if (!this.isPhoneChecked) {
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].updateValueAndValidity();
      if (this.form.controls['code'].invalid || this.form.controls['number'].invalid) {
        this.form.controls['code'].markAsTouched();
        this.form.controls['number'].markAsTouched();
        return;
      }
    } else {
      this.form.controls['password'].setValidators([Validators.required]);
      this.form.controls['password'].updateValueAndValidity();
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
    }
  }

  public openCloseSelectBox() {
    if (!this.isSelectBoxOpened) {
      this.getSelectedItemIndex();
    }
    this.isSelectBoxOpened = !this.isSelectBoxOpened;
    this.selectBoxIconUrl = this.isSelectBoxOpened ? 'assets/icons/custom-select/arrow-up.svg'
      : 'assets/icons/custom-select/arrow-down.svg'
  }

  public selectItem(countryCode: CountryCodeModel) {
    this.form.controls['code'].setValue(`+${countryCode.countryCode}`);
    this.openCloseSelectBox();
  }

  public getSelectedItemIndex() {
    const value = parseInt(this.form.controls['code'].value);
    this.selectedItemIndex = this.countryCodes.findIndex((item: CountryCodeModel) => item.countryCode === value);
  }

  public closeSelectBox(): void {
    if (this.isSelectBoxOpened) {
      this.isSelectBoxOpened = false;
      this.selectBoxIconUrl = 'assets/icons/custom-select/arrow-down.svg';
    }
  }
}
