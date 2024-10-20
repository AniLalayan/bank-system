import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {Observable} from 'rxjs';
import {LoadingService} from './shared/services/loading.service';
import {AsyncPipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'bank-system';
  loading$!: Observable<boolean>;

  constructor(private loadingService: LoadingService,
              private cdr: ChangeDetectorRef,
              private translate: TranslateService,) {
  }

  public ngOnInit() {
    this.loading$ = this.loadingService.loading$;
    const browserLang = this.translate.getBrowserLang() ?? '';
    const lang = localStorage.getItem('lang') || browserLang;
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.cdr.detectChanges();
  }
}
