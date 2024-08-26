import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,ToolbarModule,NgFor,ButtonModule,MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  menu: MenuItem[] | undefined;
  menuSeguridad: MenuItem[] | undefined;
  currentUser?: string | null;
  totalRequests: number = 0;
  completedRequests: number = 0;
  loadingPermisos: boolean = false;

  constructor(private _menuService: MenuService, private _authService: AuthService){

  }

  ngOnInit(): void {
    this.cargarMenu();
    this.currentUser = this._authService.getName();
    //this.cargarMenuSeguridad();
  }


  //INICIO GESTIÓN PERMISOS
  /*
  checkRequestsCompleted() {
    this.completedRequests++;
    if (this.completedRequests === this.totalRequests) {
      this.loadingPermisos = false;
    }
  }
    */

  
  cargarMenu(){
    this._menuService.getMenu().subscribe(data => {
      this.menu = data;
    });
  }

  /*
  cargarMenuSeguridad(){
    this._menuService.getMenuSeguridad().subscribe(data => {
      this.menuSeguridad = data;
    });
  }*/


  logOut(){
    this._authService.logOut();
  }

}