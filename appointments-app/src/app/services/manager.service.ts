import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private http: HttpClient) {}
  private managerApiUrl = environment.managerApiUrl;
  private userApiUrl = environment.userApiUrl ;

  approveAppointment(appointmentId: number): Observable<any> {
      return this.http.put(`${this.managerApiUrl}/appointment/approve?appointmentId=${appointmentId}`, {})
      .pipe(catchError(this.handleError));
  }

  cancelAppointment(appointmentId: number): Observable<any> {
      return this.http.put(`${this.managerApiUrl}/appointment/cancel?appointmentId=${appointmentId}`, {})
      .pipe(catchError(this.handleError));
  }

  deleteAppointment(appointmentId: number): Observable<any> {
      return this.http.delete(`${this.userApiUrl}/appointment?appointmentId=${appointmentId}`)
      .pipe(catchError(this.handleError));
  }

  createUser(userName: string): Observable<any> {
    const user = { name: userName };
    return this.http.post(`${this.managerApiUrl}/user`, user)
    .pipe(catchError(this.handleError));
  }

  getAppointments(sortBy: string, ascending: boolean): Observable<any[]> {
    return this.http.get<any[]>(`${this.managerApiUrl}/appointments?sortBy=${sortBy}&ascending=${ascending}`)
    .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred. Please try again.';
    
      if (error.error instanceof Object && error.error.title) {
        errorMessage = error.error.title;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please check your network.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    
      console.error('API Error:', error);
      return throwError(() => new Error(errorMessage));
    }
}
