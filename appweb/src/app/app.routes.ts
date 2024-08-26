import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { LoginComponent } from './components/login/login.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { InstructoresComponent } from './components/instructores/instructores.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { TablonActividadesComponent } from './components/tablon-actividades/tablon-actividades.component';
import { ReservasComponent } from './components/reservas/reservas.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'usuarios/clientes', component: ClientesComponent},
    {path: 'usuarios/empleados', component: EmpleadosComponent},
    {path: 'usuarios/instructores', component: InstructoresComponent},
    {path: 'actividades', component: ActividadesComponent},
    {path: 'tablon-actividades', component: TablonActividadesComponent},
    {path: 'reservas', component: ReservasComponent},
    {path: 'inicio', component: InicioComponent}
];
