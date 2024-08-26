import { ActividadesService } from '../../services/actividades.service';
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
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [TableModule,TooltipModule,ButtonModule,InputTextModule,ToolbarModule,ConfirmDialogModule,DialogModule,NgIf,FloatLabelModule,ReactiveFormsModule,
    FormsModule,ToastModule,CheckboxModule,InputNumberModule],
  templateUrl: './actividades.component.html',
  styleUrl: './actividades.component.scss',
  providers: [MessageService,ConfirmationService]
})
export class ActividadesComponent {

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
  listaActividades: any = [];
  //INICIO ATRIBUTOS FILTROS
  valorFiltroGlobal: string = '';
  //FIN ATRIBUTOS FILTROS
  //INICIO VARIABLES CREAR ACTIVIDAD
  showCrearActividadDialog: boolean = false;
  formGroup: FormGroup;
  //FIN VARIABLES CREAR ACTIVIDAD
  //INICIO VARIABLES EDITAR ACTIVIDAD
  showEditarActividadDialog: boolean = false;
  actividadEditada: any = {} //Copia del actividad seleccionado para editar
  habilitarLimiteEdit: boolean = false;
  //FIN VARIABLES EDITAR ACTIVIDAD

  constructor(private _actividadesService: ActividadesService,private fb: FormBuilder,private messageService: MessageService,private confirmationService: ConfirmationService){
    this.formGroup = this.fb.group({
      fbActividad: ['',Validators.required],
      fbLimite: []
    });
  }

  ngOnInit(): void {
    this.totalRequests = 1;
    this.completedRequests = 0;
    this.getActividades();
  }

  //INICIO GESTIÓN PERMISOS
  checkRequestsCompleted() {
    this.completedRequests++;
    if (this.completedRequests === this.totalRequests) {
      this.loadingInfo = false;
    }
  }

  getActividades(){
    this.loadingInfo = true;
    this._actividadesService.getActividades().subscribe(
      (data) => {
        this.listaActividades = data.actividades;
        this.checkRequestsCompleted();
      },
      (error) => {
        console.error('Error al obtener las actividades:', error);
      }
    );
  }



  //INICIO MÉTODOS EDITAR ACTIVIDAD
  openEditDialog(actividadSeleccionada: any){
    if(actividadSeleccionada.limite>-1){
      this.habilitarLimiteEdit = true;
    }
    this.showEditarActividadDialog = true;
    this.actividadEditada = { ...actividadSeleccionada };
  }

  actualizarActividad(){
    if(!this.habilitarLimiteEdit){
      this.actividadEditada.limite = null;
    }
    this._actividadesService.actualizarActividad(this.actividadEditada).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actividad actualizada correctamente', life: 3000 });
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getActividades();
        this.closeEditDialog();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la actividad', life: 3000 });
      }
    );
  }

  closeEditDialog(){
    this.habilitarLimiteEdit = false;
    this.showEditarActividadDialog = false;
    this.actividadEditada = {};
  }
  //FIN MÉTODOS EDITAR ACTIVIDAD

  //INICIO MÉTODOS CREAR ACTIVIDAD
  openCrearActividadDialog(){
    this.showCrearActividadDialog = true;
  }

  crearActividad(){
    var newActividad: any = {
      actividad: this.formGroup.value.fbActividad,
      limite: this.formGroup.value.fbLimite
    };
    this.insertarActividad(newActividad);
  }

  insertarActividad(newActividad: any){
    this._actividadesService.insertarActividad(newActividad).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actividad insertada correctamente', life: 3000 });
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getActividades();
        this.closeCrearDialog();
        this.formGroup.reset();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo insertar la actividad', life: 3000 });
      }
    );
  }

  closeCrearDialog(){
    this.showCrearActividadDialog = false;
    this.formGroup.reset();
  }
  //FIN MÉTODOS CREAR ACTIVIDAD

  //INICIO MÉTODOS ELIMINAR ACTIVIDAD
  deleteActividadDialog(actividad: any) {
    this.confirmationService.confirm({
        message: `Vas a eliminar la actividad ${actividad.actividad}, con ID -> ${actividad.idActividad}. Quieres continuar?`,
        header: 'Eliminar actividad',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        accept: () => {
            this.eliminarActividad(actividad.idActividad);
        }
    });
  }

  eliminarActividad(idActividad: number) {
    this._actividadesService.eliminarActividad({idActividad: idActividad}).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actividad eliminada correctamente', life: 3000 });
          this.totalRequests = 1;
          this.completedRequests = 0;
          this.getActividades();
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la actividad', life: 3000 });
        }
      );
  }
  //FIN MÉTODOS ELIMINAR ACTIVIDAD


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
    this.getActividades();
    this.valorFiltroGlobal = '';
  }


}
