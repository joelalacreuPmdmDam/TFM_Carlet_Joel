import { EmpleadosService } from '../../services/usuarios/empleados.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [TableModule,TooltipModule,ButtonModule,InputTextModule,ToolbarModule,ConfirmDialogModule,DialogModule,NgIf,FloatLabelModule,ReactiveFormsModule,FormsModule,ToastModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss',
  providers: [MessageService,ConfirmationService]
})
export class EmpleadosComponent {

  
  //INICIO VARIABLES COMPONENTES HTML
  @ViewChild('dt1') dt1: Table | undefined; //TABLA
  @ViewChild('inputSearch') inputSearch!: ElementRef; //FILTRO GLOBAL TABLA
  selectedSize = { name: 'Small', class: 'p-datatable-sm' }; //HACER FILAS MÁS PEQUEÑAS
  //END
  //INICIO GESTIÓN PERMISOS
  completedRequests!: number;
  totalRequests!: number;
  loadingInfo: boolean = true;
  //END GESTIÓN PERMISOS
  listaEmpleados: any = [];
  //INICIO ATRIBUTOS FILTROS
  valorFiltroGlobal: string = '';
  //FIN ATRIBUTOS FILTROS
  //INICIO VARIABLES CREAR USUARIO
  showCrearEmpleadoDialog: boolean = false;
  formGroup: FormGroup;
  //FIN VARIABLES CREAR USUARIO
  //INICIO VARIABLES EDITAR USUARIO
  showEditarEmpleadoDialog: boolean = false;
  empleadoEditado: any = {} //Copia del usuario seleccionado para editar
  //FIN VARIABLES EDITAR USUARIO

  constructor(private _empleadosService: EmpleadosService,private fb: FormBuilder,private messageService: MessageService,private confirmationService: ConfirmationService){
    this.formGroup = this.fb.group({
      fbDni: ['',Validators.required],
      fbNombre: ['',Validators.required],
      fbApellidos: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.totalRequests = 1;
    this.completedRequests = 0;
    this.getEmpleados();
  }

  //INICIO GESTIÓN PERMISOS
  checkRequestsCompleted() {
    this.completedRequests++;
    if (this.completedRequests === this.totalRequests) {
      this.loadingInfo = false;
    }
  }

  getEmpleados(){
    this.loadingInfo = true;
    this._empleadosService.getEmpleados().subscribe(
      (data) => {
        this.listaEmpleados = data.empleados;
        this.checkRequestsCompleted();
      },
      (error) => {
        console.error('Error al obtener los empleados:', error);
      }
    );
  }



  //INICIO MÉTODOS EDITAR USUARIO
  openEditDialog(empleadoSeleccionado: any){
    this.showEditarEmpleadoDialog = true;
    this.empleadoEditado = { ...empleadoSeleccionado };
  }

  actualizarEmpleado(){
    this._empleadosService.actualizarEmpleado(this.empleadoEditado).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleado actualizado correctamente', life: 3000 });
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getEmpleados();
        this.closeEditDialog();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el empleado', life: 3000 });
      }
    );
  }


  closeEditDialog(){
    this.showEditarEmpleadoDialog = false;
    this.empleadoEditado = {};
  }
  //FIN MÉTODOS EDITAR USUARIO

  //INICIO MÉTODOS CREAR USUARIO
  openCrearEmpleadoDialog(){
    this.showCrearEmpleadoDialog = true;
  }

  crearCliente(){
    var newEmpleado: any = {
      dni: this.formGroup.value.fbDni,
      nombre: this.formGroup.value.fbNombre,
      apellidos: this.formGroup.value.fbApellidos
    };
    this.insertarEmpleado(newEmpleado);
  }

  insertarEmpleado(newEmpleado: any){
    this._empleadosService.insertarEmpleado(newEmpleado).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleado insertado correctamente', life: 3000 });
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getEmpleados();
        this.closeCrearDialog();
        this.formGroup.reset();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo insertar el Empleado', life: 3000 });
      }
    );
  }

  closeCrearDialog(){
    this.showCrearEmpleadoDialog = false;
  }
  //FIN MÉTODOS CREAR USUARIO

  //INICIO MÉTODOS ELIMINAR USUARIO
  deleteEmpleadoDialog(empleado: any) {
    this.confirmationService.confirm({
        message: `Vas a eliminar al empleado ${empleado.nombre} ${empleado.apellidos}, con ID -> ${empleado.idEmpleado}. Quieres continuar?`,
        header: 'Eliminar empleado',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        accept: () => {
            this.eliminarEmpleado(empleado.idEmpleado);
        }
    });
  }

  eliminarEmpleado(idEmpleado: number) {
    this._empleadosService.eliminarEmpleado({idEmpleado: idEmpleado}).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Empleado eliminado correctamente', life: 3000 });
          this.totalRequests = 1;
          this.completedRequests = 0;
          this.getEmpleados();
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar al empleado', life: 3000 });
        }
      );
  }
  //FIN MÉTODOS ELIMINAR CLIENTE


  //MÉTODO FILTRO GLOBAL
  onInput(event: Event) {
    if (event.target instanceof HTMLInputElement && this.dt1) {
      this.dt1.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  }

  //MÉTODO PARA LIMPIAR LOS FILTROS
  clear(table: Table) {
    this.totalRequests = 1;
    this.completedRequests = 0;
    table.clear();
    this.getEmpleados();
    this.valorFiltroGlobal = '';
  }
}
