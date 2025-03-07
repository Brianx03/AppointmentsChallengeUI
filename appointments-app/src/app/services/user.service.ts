import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl;

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/appointment?appointmentId=${appointmentId}`)
    .pipe(catchError(this.handleError));
  }
  getUserAppointments(user: number, sortBy: string, ascending: boolean): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/appointments?userid=${user}&sortBy=${sortBy}&ascending=${ascending}`)
    .pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/manager/users`).pipe(
    catchError(this.handleError)
  );
}

  createAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/appointments`, appointment).pipe(
      catchError(this.handleError) 
    );
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
  
  updateAppointment(appointment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/appointment`, appointment);
  }  
}
