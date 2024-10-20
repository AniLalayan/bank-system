import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {ClickOutsideDirective} from '../../directives/click-outside.directive';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgClass, ClickOutsideDirective],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent {
  @Input() items: any[] = [];
  @Input() selectedItemIndex: number = 0;
  @Input() iconUrl!: string;
  @Input() selectedItemLabel: string = '';
  @Input() placeholder: string = '';
  @Input() inputClassName: string = '';
  @Input() dropdownOptionsClassName!: string;
  @Input() passportDropdownArrowClassName!: string;
  @Input() isDropdownDisabled!: boolean;

  @Output() itemSelected = new EventEmitter<any>();
  public isDropdownOpened = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  public toggleDropdown(): void {
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  public selectItem(item: any, index: number): void {
    this.itemSelected.emit(item);
    this.selectedItemIndex = index;
    this.closeDropdown();
  }

  public closeDropdown(): void {
    this.isDropdownOpened = false;
  }

  public getKeys(item: any): string[] {
    return Object.keys(item);
  }
}
