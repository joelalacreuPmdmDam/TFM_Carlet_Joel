import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DatePipe, NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ClientesService } from '../../services/usuarios/clientes.service';
import { ReservasService } from '../../services/reservas.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [TableModule,TooltipModule,ButtonModule,InputTextModule,ToolbarModule,ConfirmDialogModule,DialogModule,NgIf,FloatLabelModule,ToastModule,
    DropdownModule,DatePipe,FormsModule,ReactiveFormsModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss',
  providers: [MessageService,ConfirmationService,DatePipe]
})
export class ReservasComponent {

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
   listaReservas: any = [];
   listaClientes: any;
  //INICIO ATRIBUTOS FILTROS
  valorFiltroGlobal: string = '';
  //FIN ATRIBUTOS FILTROS
  //INICIO VARIABLES EDITAR RESERVA
  showEditarReservaDialog: boolean = false;
  reservaEditada: any = {} //Copia de la reserva seleccionado para editar
  selectedClienteReserva: any = {}; //VARIABLE QUE GUARDA EL CLIENTE DE LA RESERVA A EDITAR
  //FIN VARIABLES EDITAR RESERVA

  constructor(private _reservasService: ReservasService,private _clientesService: ClientesService,private messageService: MessageService,
    private datePipe: DatePipe,private confirmationService: ConfirmationService){
  
  }

  ngOnInit(): void {
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
    this.getReservas();
    this.getClientes();
  }

  getReservas(){
    this.loadingInfo = true;
    this._reservasService.getReservas().subscribe(
      (data) => {
        this.listaReservas = data.reservas;
        this.checkRequestsCompleted();
      },
      (error) => {
        console.error('Error al obtener las reservas:', error);
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
  //FIN MÉTODOS GET INFO

  //INICIO EDITAR RESERVA
  openEditDialog(reserva: any){
    this.showEditarReservaDialog = true;
    this.reservaEditada = { ...reserva };
    this.encontrarClienteReserva(reserva.idCliente);
  }

  actualizarReserva(){
    var reserva = {
      idReserva: this.reservaEditada.idReserva,
      idCliente: this.selectedClienteReserva.idCliente 
    };
    this._reservasService.actualizarReserva(reserva).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reserva actualizada correctamente', life: 3000 });
        this.totalRequests = 1;
        this.completedRequests = 0;
        this.getReservas();
        this.closeEditDialog();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la reserva', life: 3000 });
      }
    );
  }

  encontrarClienteReserva(idCliente: number){
    this.selectedClienteReserva = this.listaClientes.find((cliente: any) => cliente.idCliente === idCliente);
  }

  closeEditDialog(){
    this.reservaEditada = {};
    this.showEditarReservaDialog = false;
  }
  //FIN MÉTODOS EDITAR RESERVA

  //INICIO MÉTODOS ELIMINAR RESERVA
  deleteReservaDialog(reserva: any){
    this.confirmationService.confirm({
        message: `Vas a eliminar la reserva del cliente ${reserva.cliente} para la actividad ${reserva.actividad} con fecha -> ${this.datePipe.transform(reserva.fecha,'dd/MM/yy HH:mm:ss')} y ID -> ${reserva.idReserva}. Quieres continuar?`,
        header: 'Eliminar cliente',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        accept: () => {
            this.eliminarReserva(reserva.idReserva);
        }
    });
  }

  eliminarReserva(idReserva: number) {
    this._reservasService.eliminarReserva({idReserva: idReserva}).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reserva eliminada correctamente', life: 3000 });
          this.totalRequests = 1;
          this.completedRequests = 0;
          this.getReservas();
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la reserva', life: 3000 });
        }
      );
  }
  //FIN MÉTODOS ELIMINAR RESERVA

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
    this.getReservas();
    this.valorFiltroGlobal = '';
  }

}
