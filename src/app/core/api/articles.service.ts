import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Article, Paginated } from '../models/article.model';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly http = inject(HttpClient);

  list(page = 1): Observable<Paginated<Article>> {
    return this.http.get<Paginated<Article>>(`${environment.apiBaseUrl}/articles`, {
      params: { page },
    });
  }

  get(id: number): Observable<{ data: Article }> {
    return this.http.get<{ data: Article }>(`${environment.apiBaseUrl}/articles/${id}`);
  }

  dispatchFetch(): Observable<{ data: Job }> {
    return this.http.post<{ data: Job }>(`${environment.apiBaseUrl}/articles/fetch-job`, {});
  }
}
