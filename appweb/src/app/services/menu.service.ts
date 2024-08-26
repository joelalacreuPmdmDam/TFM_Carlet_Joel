import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'https://datamanager.improlog.com/restapi/seguridad/menu'
  private token?: string

  constructor(private http: HttpClient,private _authService: AuthService) { }

  
  getMenu(): Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>('assets/data/menu.json');
  }

  /*
  getMenuSeguridad(): Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>('./assets/data/menu_seguridad.json');
  }
    */

  /*
  setMenu(menu: any){
    sessionStorage.setItem('menu', menu);
  }
    

  getMenuSessionStorage(){
    const menu = sessionStorage.getItem('menu')
    if (menu){
      return menu;
    }else{
      return 'Not found'
    }    
  }
    

  
  getMenu() {
    this.token = this._authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<any>(this.apiUrl, { headers });
  }
    */

}
