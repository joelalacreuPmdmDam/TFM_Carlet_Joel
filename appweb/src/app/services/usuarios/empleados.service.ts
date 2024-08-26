import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private apiUrl = 'http://192.168.56.1:5000/empleados'
  private token?: string
    

  constructor(private http: HttpClient,private _authService: AuthService) { }


  
  getEmpleados() {
    this.token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<any>(`${this.apiUrl}/obtener`, { headers })
  }
  

  insertarEmpleado(empleado: any){
    const url = this.apiUrl+`/insertar`;
    const token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(url, empleado ,{ headers });
  }
  
  actualizarEmpleado(empleado: any){
    const token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/editar`, empleado ,{ headers });
  }

  eliminarEmpleado(empleado: any){
    const token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/eliminar`, empleado, { headers });
  }
}
