import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { PickListModule } from 'primeng/picklist';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonModule } from 'primeng/button';
import { NgClass, NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EmpleadosService } from '../../services/usuarios/empleados.service';
import { InstructoresService } from '../../services/usuarios/instructores.service';
import { ActividadesService } from '../../services/actividades.service';

@Component({
  selector: 'app-instructores',
  standalone: true,
  imports: [TableModule,ToastModule,ToolbarModule,PickListModule,DragDropModule,ButtonModule,NgIf,NgClass],
  templateUrl: './instructores.component.html',
  styleUrl: './instructores.component.scss',
  providers: [MessageService]
})
export class InstructoresComponent {

  completedRequests!: number;
  totalRequests!: number;
  loadingInfo: boolean = true;
  selectedEmpleado: any;
  listaInstructores: any[] = []
  selectedRow: any;
  sourceActividades: any[] = []
  targetActividades: any[] = []
  cabeceraTargetActividades = "Actividades del empledao";

  constructor(private _empleadosService: EmpleadosService, private _instructoresService: InstructoresService, private _actividadesService: ActividadesService,
    private messageService: MessageService){
    
  }

  
  ngOnInit(): void {
    this.totalRequests = 1;
    this.completedRequests = 0;
    this.getInstructores();
    console.log(this.selectedEmpleado)
  }

  
  //INICIO GESTIÓN PERMISOS
  checkRequestsCompleted() {
    this.completedRequests++;
    if (this.completedRequests === this.totalRequests) {
      this.loadingInfo = false;
    }
  }

  getInstructores(){
    this.loadingInfo = true;
    this._instructoresService.getInstructores().subscribe(
      (data) => {
        this.listaInstructores = data.instructores;
        this.checkRequestsCompleted();
      },
      (error) => {
        console.error('Error al obtener los instructores:', error);
      }
    );
  }

  getActividades(){
    this._actividadesService.getActividades().subscribe(
      (data) => {
        this.sourceActividades = data.actividades;
      },
      (error) => {
        console.error('Error al obtener las actividades:', error);
      }
    );
  }


  getActividadesEmpleado(){
    console.log(this.selectedEmpleado.idEmpleado)
    this._instructoresService.getActividadesInstructor(this.selectedEmpleado.idEmpleado).subscribe(
      (data) => {
        this.targetActividades = data.actividades;
      },
      (error) => {
        console.error('Error al obtener las actividades del instructor:', error);
      }
    );
  }

  buscarActividadesInstructor(){
    this.selectedEmpleado = this.selectedRow;
    this.cabeceraTargetActividades = `Actividades del empledao -> ${this.selectedRow.nombre}`
    this.getActividadesEmpleado();
    this.getActividades();
    setTimeout(()=>{
      this.getSourceActividades();
    },100)
    setTimeout(() => {
      this.selectedRow = null;
    }, 100);
  }

  getSourceActividades(){
    this.sourceActividades = this.sourceActividades.filter(item => !this.targetActividades.some(targetItem => this.areEqual(item, targetItem)));
  }
  
  areEqual(obj1: any, obj2: any): boolean {
    return obj1.idActividad === obj2.idActividad && obj1.actividad === obj2.actividad;
  }


  


  guardarCambios(){
    this._instructoresService.editarActividadesInstructor(this.selectedEmpleado.idEmpleado,this.targetActividades).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actividades del instructor modificadas correctamente', life: 3000 });
        this.selectedEmpleado = undefined;
        this.targetActividades = [];
        this.sourceActividades = [];
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getInstructores();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron modificar las actividades del instructor', life: 3000 });
      }
    );
  }

  descartarCambios(){
    this.cabeceraTargetActividades = `Actividades del empledao -> ${this.selectedEmpleado.nombre}`  
    this.getActividadesEmpleado();
    this.getActividades();
    setTimeout(()=>{
      this.getSourceActividades();
    },100)
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Cambios descartados', life: 3000 });
  }
}
