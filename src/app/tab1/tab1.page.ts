// cultural_events_app/src/app/tab1/tab1.page.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class Tab1Page implements OnInit {
  eventos: any[] = [];
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Opcional: Você pode manter o ngOnInit para a primeira carga ao iniciar o app,
    // mas ionViewWillEnter vai garantir que sempre atualize.
    // this.carregarEventos();
  }

  // --- NOVO MÉTODO DE LIFECYCLE HOOK DO IONIC ---
  ionViewWillEnter() {
    this.carregarEventos(); // Chama o método para recarregar a lista sempre que a página for acessada
  }
  // --- FIM DO NOVO MÉTODO ---

  carregarEventos() {
    this.apiService.getEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.errorMessage = 'Não foi possível carregar os eventos. Verifique se o backend está rodando e o CORS configurado.';
      }
    });
  }

  handleRefresh(event: any) {
    this.carregarEventos();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  editarEvento(id: number) {
    this.router.navigate(['/event-form', id]);
  }

  async confirmarExclusao(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluirEvento(id);
          },
        },
      ],
    });

    await alert.present();
  }

  excluirEvento(id: number) {
    this.apiService.deleteEvento(id).subscribe({
      next: () => {
        this.presentToast('Evento excluído com sucesso!', 'success');
        // carregarEventos() já é chamado por ionViewWillEnter ao retornar para a página
        // Opcional: Se quiser uma atualização *imediatamente* antes mesmo do ionViewWillEnter, mantenha aqui
        this.carregarEventos(); // Manter aqui para garantir update instantâneo
      },
      error: (error) => {
        console.error('Erro ao excluir evento:', error);
        this.presentToast('Erro ao excluir evento.', 'danger');
      }
    });
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}