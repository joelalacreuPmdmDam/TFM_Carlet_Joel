import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { TablonActsService } from '../../services/tablon-acts.service';
import { ActividadesService } from '../../services/actividades.service';
import { DropdownModule } from 'primeng/dropdown';
import { ReservasService } from '../../services/reservas.service';
import { ClientesService } from '../../services/usuarios/clientes.service';
import { InstructoresService } from '../../services/usuarios/instructores.service';

@Component({
  selector: 'app-tablon-actividades',
  standalone: true,
  imports: [TableModule,TooltipModule,ButtonModule,InputTextModule,ToolbarModule,ConfirmDialogModule,DialogModule,NgIf,FloatLabelModule,ReactiveFormsModule,
    FormsModule,ToastModule,CalendarModule,DropdownModule,DatePipe,NgClass],
  templateUrl: './tablon-actividades.component.html',
  styleUrl: './tablon-actividades.component.scss',
  providers: [MessageService,ConfirmationService,DatePipe]
})
export class TablonActividadesComponent {


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
  listaTablonActs: any = [];
  listaActividades: any;
  listaClientes: any;
  listaInstructoresDisponibles: any = [];
  //INICIO ATRIBUTOS FILTROS
  valorFiltroGlobal: string = '';
  //FIN ATRIBUTOS FILTROS
  //INICIO VARIABLES CREAR
  showCrearTablonActDialog: boolean = false;
  formGroup: FormGroup;
  today!: Date;
  //FIN VARIABLES CREAR
  //INICIO VARIABLES EDITAR
  showEditarTablonActDialog: boolean = false;
  tablonActEditada: any = {} //Copia del objeto tablonAct seleccionado para editar
  //FIN VARIABLES EDITAR
  //INICIO VARIABLES RESERVAR ACT
  showReservarDialog: boolean = false;
  selectedActTablonReserva: any;
  reservarDialogHeader: string = '';
  selectedClienteReserva: any = {};
  //FIN VARIABLES RESERVAR ACT
  //INICIO VARIABLES ASIGNAR INSTRUCTOR
  selectedInstructor: any = {};
  //FIN VARIABLES ASIGNAR INSTRUCTOR

  constructor(private _tablonActsService: TablonActsService,private _actividadesService: ActividadesService,private fb: FormBuilder,private messageService: MessageService,
    private datePipe: DatePipe,private confirmationService: ConfirmationService, private _reservasService: ReservasService, private _clientesService: ClientesService,
     private _instructoresService: InstructoresService){
    this.formGroup = this.fb.group({
      fbSelectedActividad: [Validators.required],
      fbFecha: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.today = new Date();
    this.totalRequests = 2;
    this.completedRequests = 0;
    this.getInfo();
  }

  //INICIO GESTIÓN PERMISOS
  checkRequestsCompleted() {
    this.completedRequests++;
    if (this.completedRequests === this.totalRequests) {
      this.loadingInfo = false;
    }
  }

  //INICIO MÉTODOS GET INFO
  getInfo(){
    this.getTablonActs();
    this.getActividades();
    this.getClientes();
  }

  getTablonActs(){
    this.loadingInfo = true;
    this._tablonActsService.getTablonActs().subscribe(
      (data) => {
        this.listaTablonActs = data.tablonActividades;
        this.checkRequestsCompleted();
      },
      (error) => {
        console.error('Error al obtener el tablon de las actividades:', error);
      }
    );
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

  getClientes(){
    this.loadingInfo = true;
    this._clientesService.getClientes().subscribe(
      (data) => {
        this.listaClientes = data.clientes;
        this.checkRequestsCompleted();
      },
      (error) => {
        console.error('Error al obtener los clientes:', error);
      }
    );
  }

  getInstructoresDisponibles(info: any){
    this.loadingInfo = true;
    this._instructoresService.getInstructoresDispo(info).subscribe(
      (data) => {
        this.listaInstructoresDisponibles = data.instructores;
        this.checkRequestsCompleted();
        this.showEditarTablonActDialog = true;
      },
      (error) => {
        console.error('Error al obtener los instructores disponibles:', error);
      }
    );
  }
  //FIN MÉTODOS GET INFO

  formatearFechaFormulario(){//MÉTODO PARA FORMATEAR AL FORMATO ACEPTADO POR LA BDA
    const fechaSeleccionada = this.formGroup.value.fbFecha;
    const fechaISO8601 = new Date(fechaSeleccionada).toISOString(); // Convierte la fecha local a formato ISO 8601
    const fecha = new Date(fechaISO8601);
    fecha.setHours(fecha.getHours() + 2);
    fecha.setSeconds(0);
    return fecha
  }


  //INICIO MÉTODOS CREAR ACT TABLON
  openCrearTablonActDialog(){
    this.showCrearTablonActDialog = true;
  }

  crearTablonAct(){
    var newTablonAct: any = {
      idActividad: this.formGroup.value.fbSelectedActividad.idActividad,
      fecha: this.formatearFechaFormulario()
    };
    this.insertarTablonAct(newTablonAct);
  }

  insertarTablonAct(newTablonAct: any){
    this._tablonActsService.insertarTablonAct(newTablonAct).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actividad insertada al tablon correctamente', life: 3000 });
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getTablonActs();
        this.closeCrearDialog();
        this.formGroup.reset();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo insertar la actividad al tablon', life: 3000 });
      }
    );
  }

  closeCrearDialog(){
    this.showCrearTablonActDialog = false;
  }
  //FIN MÉTODOS CREAR ACT TABLON

  //INICIO MÉTODOS ASIGNAR INSTRUCTOR A ACT TABLON
  openEditDialog(actTablon: any){
    this.completedRequests = 0;
    this.totalRequests = 1;    
    var info = {
      idActividad: actTablon.idActividad,
      fecha: actTablon.fecha
    };
    this.tablonActEditada = { ...actTablon };
    this.getInstructoresDisponibles(info);   
  }

  asignarInstructor(){
    var actTablon = {
      id: this.tablonActEditada.id,
      idEmpleado: this.selectedInstructor.idEmpleado
    }
    this._tablonActsService.actualizarTablonAct(actTablon).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Se ha asignado el instructor correctamente', life: 3000 });
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getTablonActs();
        this.showEditarTablonActDialog = false;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar el instructor a la actividad del tablon', life: 3000 });
      }
    );
  }
  //FIN MÉTODOS ASIGNAR INSTRUCTOR A ACT TABLON


  //INICIO MÉTODOS ELIMINAR ACT TABLON
  deleteTablonActDialog(actTablon: any){
    this.confirmationService.confirm({
        message: `Vas a eliminar la actividad ${actTablon.actividad} con fecha -> ${this.datePipe.transform(actTablon.fecha,'dd/MM/yy HH:mm:ss')} y ID -> ${actTablon.id}. Quieres continuar?`,
        header: 'Eliminar cliente',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        accept: () => {
            this.eliminarTablonAct(actTablon.id);
        }
    });
  }

  eliminarTablonAct(idTablonAct: number) {
    this._tablonActsService.eliminaTablonAct({id: idTablonAct}).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actividad eliminada del tablon correctamente', life: 3000 });
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getTablonActs();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la actividad del tablon', life: 3000 });
      }
    );
  }
  //FIN MÉTODOS ELIMINAR ACT TABLON

  //INICIO MÉTODOS RESERVAR ACT TABLON
  openReservarTablonActDialog(actTablon: any){
    this.selectedClienteReserva = {};
    this.reservarDialogHeader = `Reservar -> ${actTablon.actividad} - ${this.datePipe.transform(actTablon.fecha,'dd/MM/yy HH:mm:ss')}`;
    this.selectedActTablonReserva = { ...actTablon };
    this.showReservarDialog = true;
  }

  reservarTablonAct() {
    var reserva = {
      idCliente: this.selectedClienteReserva.idCliente,
      idActividadTablon: this.selectedActTablonReserva.id
    }
    this._reservasService.insertarReserva(reserva).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reserva realizada correctamente', life: 3000 });
          this.completedRequests = 0;
          this.totalRequests = 1;
          this.getTablonActs();
          this.closeReservarTablonActDialog();
        },
        (error) => {
          console.log(reserva)
          console.error(error)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar la reserva', life: 3000 });
        }
      );
  }

  closeReservarTablonActDialog(){
    this.reservarDialogHeader = '';
    this.selectedActTablonReserva = {};
    this.showReservarDialog = false;
  }
  //FIN MÉTODOS RESERVAR ACT TABLON

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
    this.getTablonActs();
    this.valorFiltroGlobal = '';
  }

}
