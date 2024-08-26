import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 
  private apiUrl = 'http://192.168.56.1:5000/auth/login';
  email: string = '';
  currentUser: string = '';
  

  constructor(private http: HttpClient, private router: Router) { }

  login(correo: string, pass: string): Observable<any> {
    const body = {
      mail: correo,
      contrasenya: pass,
      audience: 'RoncaFit'
    };

    return this.http.post<any>(this.apiUrl, body).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError('Ha ocurrido un error al intentar iniciar sesión');
      })
    );
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  getToken() {
    const token = sessionStorage.getItem('token');
    if (token) {
        return token;
    } else {
        return 'Token not found';
    }
  }

  setName(name: string) {
    sessionStorage.setItem('currentUser',name);
  }

  getName(){
    const name = sessionStorage.getItem('currentUser')
    if (name){
      return name;
    }else{
      return 'Not found'
    }    
  }


  logOut(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
