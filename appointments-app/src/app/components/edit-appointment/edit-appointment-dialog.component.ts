import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-appointment-dialog',
  standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatDialogModule

    ],
  templateUrl: './edit-appointment-dialog.component.html',
  styleUrls: ['./edit-appointment-dialog.component.scss']
})
export class EditAppointmentDialogComponent {
  editedAppointment: any;

  constructor(
    public dialogRef: MatDialogRef<EditAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const date = new Date(data.appointment.date);
    this.editedAppointment = {
      description: data.appointment.description,
      date: date,         
      time: this.formatTime(date),
      userId: data.appointment.userId,
      appointmentId: data.appointment.appointmentId,
    };
  }
  
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }  

  save() {
    const [hours, minutes] = this.editedAppointment.time.split(':').map(Number);
    
    const adjustedDate = new Date(this.editedAppointment.date);
    adjustedDate.setHours(hours, minutes, 0, 0); 
  
    this.editedAppointment.date = `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')}T${adjustedDate.getHours().toString().padStart(2, '0')}:${adjustedDate.getMinutes().toString().padStart(2, '0')}:00`;
  
    this.dialogRef.close(this.editedAppointment);
  }
  

  close() {
    this.dialogRef.close();
  }
}
