import {ChangeDetectorRef, Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {Observable} from 'rxjs';
import {LoadingService} from './shared/services/loading.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bank-system';
  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService, private cdr: ChangeDetectorRef) {
    this.loading$ = this.loadingService.loading$;
  }
}
