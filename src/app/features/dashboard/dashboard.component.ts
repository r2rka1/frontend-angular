import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ArticlesService } from '../../core/api/articles.service';
import { JobsService } from '../../core/api/jobs.service';
import { AuthService } from '../../core/auth/auth.service';
import { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-semibold mb-2">Welcome{{ user() ? ', ' + user()!.name : '' }}</h1>
      <p class="text-slate-600 mb-6">
        Fire a job to fetch fresh Wikipedia articles about Space.
      </p>

      <button
        (click)="fetchArticles()"
        [disabled]="busy()"
        class="px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {{ busy() ? 'Fetching…' : 'Fetch new articles' }}
      </button>

      @if (currentJob(); as job) {
        <div class="mt-6 border border-slate-200 rounded p-4 text-sm">
          <p>Job <span class="font-mono text-xs">{{ job.id }}</span></p>
          <p>Status: <span class="font-semibold">{{ job.status }}</span></p>
          @if (job.status === 'done') {
            <button
              (click)="goToArticles()"
              class="mt-3 underline text-slate-900"
            >
              View articles →
            </button>
          }
          @if (job.status === 'failed') {
            <p class="mt-3 text-red-600">{{ job.error }}</p>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardComponent {
  private readonly articles = inject(ArticlesService);
  private readonly jobs = inject(JobsService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly busy = signal(false);
  readonly currentJob = signal<Job | null>(null);
  private pollSub: Subscription | null = null;

  ngOnInit(): void {
    if (!this.user()) {
      this.auth.fetchMe().subscribe();
    }
  }

  fetchArticles(): void {
    this.busy.set(true);
    this.articles.dispatchFetch().subscribe({
      next: (res) => {
        this.currentJob.set(res.data);
        this.startPolling(res.data.id);
      },
      error: () => this.busy.set(false),
    });
  }

  private startPolling(jobId: string): void {
    this.pollSub?.unsubscribe();
    this.pollSub = this.jobs.poll(jobId).subscribe({
      next: (job) => {
        this.currentJob.set(job);
        if (job.status === 'done' || job.status === 'failed') {
          this.busy.set(false);
        }
      },
      error: () => this.busy.set(false),
    });
  }

  goToArticles(): void {
    this.router.navigateByUrl('/articles');
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }
}
