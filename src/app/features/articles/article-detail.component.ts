import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ArticlesService } from '../../core/api/articles.service';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink, DatePipe],
  template: `
    <a routerLink="/articles" class="text-sm text-slate-500 underline">← Back to list</a>

    @if (loading()) {
      <p class="mt-6 text-slate-500">Loading…</p>
    } @else if (article(); as a) {
      <article class="bg-white rounded shadow p-6 mt-4">
        <h1 class="text-2xl font-semibold mb-2">{{ a.title }}</h1>
        @if (a.fetched_at) {
          <p class="text-xs text-slate-400 mb-4">
            Fetched {{ a.fetched_at | date: 'medium' }}
          </p>
        }
        <p class="text-slate-700 mb-4">{{ a.summary }}</p>
        @if (a.content) {
          <div class="prose max-w-none" [innerHTML]="a.content"></div>
        }
        <p class="mt-6 text-sm">
          <a [href]="a.source_url" target="_blank" rel="noopener" class="underline">
            View on Wikipedia
          </a>
        </p>
      </article>
    } @else {
      <p class="mt-6 text-slate-500">Article not found.</p>
    }
  `,
})
export class ArticleDetailComponent {
  private readonly api = inject(ArticlesService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly article = signal<Article | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.get(id).subscribe({
      next: (res) => {
        this.article.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
