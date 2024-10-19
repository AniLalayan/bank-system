import {Component, Input} from '@angular/core';
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CountryCodeModel} from '../../models/country-code.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [ NgClass, FormsModule, ReactiveFormsModule,],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss'
})
export class CustomDropdownComponent {
  @Input() items: CountryCodeModel[] = [];
  @Input() formControl!: AbstractControl;
  @Input() label: string = '';
  @Input() placeholder: string = '';

  public isDropdownOpened = false;
  public selectBoxIconUrl = 'assets/icons/custom-select/arrow-down-light.svg';
  public selectedItem: CountryCodeModel | null = null;

  toggleDropdown() {
    this.isDropdownOpened = !this.isDropdownOpened;
    this.selectBoxIconUrl = this.isDropdownOpened ? 'assets/icons/custom-select/arrow-up.svg' : 'assets/icons/custom-select/arrow-down-light.svg';
  }

  selectItem(item: CountryCodeModel) {
    this.selectedItem = item;
    this.formControl.setValue(`+${item.countryCode}`);
    this.toggleDropdown();
  }
}
