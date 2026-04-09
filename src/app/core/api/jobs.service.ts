import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);

  get(id: string): Observable<{ data: Job }> {
    return this.http.get<{ data: Job }>(`${environment.apiBaseUrl}/jobs/${id}`);
  }

  /**
   * Polls a job every 2s until status reaches `done` or `failed`.
   * Emits the final job state inclusively.
   */
  poll(id: string): Observable<Job> {
    return interval(2000).pipe(
      switchMap(() => this.get(id)),
      // unwrap to bare Job
      switchMap((res) => Promise.resolve(res.data)),
      takeWhile((job) => job.status !== 'done' && job.status !== 'failed', true),
    );
  }
}
