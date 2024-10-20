import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LanguageSwitcherComponent {
  constructor(private translate: TranslateService) {}

  public switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('lang', language);
  }

}
