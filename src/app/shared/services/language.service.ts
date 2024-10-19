import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private http: HttpClient, private translate: TranslateService) {}

  switchLanguage(language: string) {
    this.http.get(`./src/translations/${language}.json`).subscribe((translations: any) => {
      this.translate.setTranslation(language, translations);
      this.translate.use(language);
    });
  }
}
