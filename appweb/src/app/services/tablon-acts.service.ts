import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TablonActsService {

  private apiUrl = 'http://192.168.56.1:5000/tablonActividades'
  private token?: string
    

  constructor(private http: HttpClient,private _authService: AuthService) { }


  
  getTablonActs() {
    this.token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<any>(`${this.apiUrl}/obtener`, { headers })
  }

  insertarTablonAct(actTablon: any){
    const url = this.apiUrl+`/insertar`;
    const token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(url, actTablon ,{ headers });
  }
  
  actualizarTablonAct(actTablon: any){
    const token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/editar`, actTablon ,{ headers });
  }

  eliminaTablonAct(actTablon: any){
    const token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/eliminar`, actTablon, { headers });
  }
}
