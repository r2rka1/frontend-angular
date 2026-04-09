import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

const passwordsMatch = (group: AbstractControl): ValidationErrors | null => {
  const a = group.get('password')?.value;
  const b = group.get('password_confirmation')?.value;
  return a && b && a !== b ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-sm mx-auto bg-white rounded-lg shadow p-6 mt-12">
      <h1 class="text-xl font-semibold mb-4">Create account</h1>
      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-3">
        <div>
          <label class="block text-sm text-slate-700 mb-1">Name</label>
          <input
            formControlName="name"
            class="w-full border border-slate-300 rounded px-3 py-2"
          />
          @if (form.controls.name.touched && form.controls.name.invalid) {
            <p class="text-xs text-red-600 mt-1">Name is required.</p>
          }
        </div>
        <div>
          <label class="block text-sm text-slate-700 mb-1">Email</label>
          <input
            type="email"
            formControlName="email"
            class="w-full border border-slate-300 rounded px-3 py-2"
          />
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <p class="text-xs text-red-600 mt-1">Enter a valid email.</p>
          }
        </div>
        <div>
          <label class="block text-sm text-slate-700 mb-1">Password</label>
          <input
            type="password"
            formControlName="password"
            class="w-full border border-slate-300 rounded px-3 py-2"
          />
          @if (form.controls.password.touched && form.controls.password.invalid) {
            <p class="text-xs text-red-600 mt-1">Password must be at least 8 characters.</p>
          }
        </div>
        <div>
          <label class="block text-sm text-slate-700 mb-1">Confirm password</label>
          <input
            type="password"
            formControlName="password_confirmation"
            class="w-full border border-slate-300 rounded px-3 py-2"
          />
          @if (
            form.controls.password_confirmation.touched &&
            form.errors?.['passwordsMismatch']
          ) {
            <p class="text-xs text-red-600 mt-1">Passwords do not match.</p>
          }
        </div>
        @if (error()) {
          <p class="text-sm text-red-600">{{ error() }}</p>
        }
        <button
          type="submit"
          [disabled]="form.invalid || loading()"
          class="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-700 disabled:opacity-50"
        >
          {{ loading() ? 'Creating…' : 'Create account' }}
        </button>
      </form>
      <p class="text-sm text-slate-500 mt-4">
        Already have an account?
        <a routerLink="/login" class="text-slate-900 underline">Sign in</a>
      </p>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
    },
    { validators: [passwordsMatch] },
  );

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Registration failed');
        this.loading.set(false);
      },
    });
  }
}
