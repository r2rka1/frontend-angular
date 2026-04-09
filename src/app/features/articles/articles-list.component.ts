import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticlesService } from '../../core/api/articles.service';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'app-articles-list',
  imports: [RouterLink, DatePipe],
  template: `
    <h1 class="text-2xl font-semibold mb-4">Your articles</h1>

    @if (loading()) {
      <p class="text-slate-500">Loading…</p>
    } @else if (articles().length === 0) {
      <p class="text-slate-500">
        No articles yet. Go back to the
        <a routerLink="/" class="underline">dashboard</a> and fetch some.
      </p>
    } @else {
      <ul class="space-y-3">
        @for (a of articles(); track a.id) {
          <li class="bg-white rounded shadow p-4 hover:shadow-md transition">
            <a [routerLink]="['/articles', a.id]" class="block">
              <h2 class="text-lg font-semibold text-slate-900">{{ a.title }}</h2>
              <p class="text-sm text-slate-600 line-clamp-2">{{ a.summary }}</p>
              @if (a.fetched_at) {
                <p class="text-xs text-slate-400 mt-1">
                  Fetched {{ a.fetched_at | date: 'medium' }}
                </p>
              }
            </a>
          </li>
        }
      </ul>
    }
  `,
})
export class ArticlesListComponent {
  private readonly api = inject(ArticlesService);

  readonly loading = signal(true);
  readonly articles = signal<Article[]>([]);

  ngOnInit(): void {
    this.api.list().subscribe({
      next: (res) => {
        this.articles.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
