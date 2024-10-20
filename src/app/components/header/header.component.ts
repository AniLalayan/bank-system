import {Component, Input} from '@angular/core';
import {LanguageSwitcherComponent} from '../../shared/components/language-switcher/language-switcher.component';
import {headerMenuItems} from '../../shared/constants';
import {UserDataModel} from '../../shared/models/user-data.model';
import {ApiService} from '../../shared/services/api.service';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {TranslateModule} from '@ngx-translate/core';
import {ClickOutsideDirective} from '../../shared/directives/click-outside.directive';
import {NgClass} from '@angular/common';
import {DropdownComponent} from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LanguageSwitcherComponent, TranslateModule, ClickOutsideDirective, NgClass, DropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input() public userData!: UserDataModel;
  public headerMenuItems = headerMenuItems;

  constructor(private authService: AuthService) {}

  public logout() {
    this.authService.logout();
  }

  onItemSelected(item: any) {
    // Handle selected item
  }
}
