import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col">
      <header class="bg-white border-b border-slate-200">
        <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a routerLink="/" class="text-lg font-semibold text-slate-900">Space Articles</a>
          <nav class="flex items-center gap-4 text-sm">
            <a routerLink="/articles" class="text-slate-600 hover:text-slate-900">Articles</a>
            @if (user()) {
              <span class="text-slate-500">{{ user()!.email }}</span>
              <button
                (click)="logout()"
                class="px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-700"
              >
                Logout
              </button>
            }
          </nav>
        </div>
      </header>
      <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;

  logout(): void {
    this.auth.logout().subscribe({
      complete: () => this.router.navigateByUrl('/login'),
      error: () => {
        this.auth.clear();
        this.router.navigateByUrl('/login');
      },
    });
  }
}
