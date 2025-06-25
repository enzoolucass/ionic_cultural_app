// cultural_events_app/src/app/tab2/tab2.page.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
// Mude IonViewWillEnter para ViewWillEnter aqui
import { IonicModule, AlertController, ToastController, ViewWillEnter } from '@ionic/angular'; // <-- MUDANÇA AQUI
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
// Mude IonViewWillEnter para ViewWillEnter aqui também
export class Tab2Page implements OnInit, ViewWillEnter { // <-- MUDANÇA AQUI
  artistas: any[] = [];
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // ionViewWillEnter cuidará do carregamento inicial e subsequente
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter (Tab2) acionado! Recarregando artistas...');
    this.carregarArtistas();
  }

  carregarArtistas() {
    this.apiService.getArtistas().subscribe({
      next: (data) => {
        this.artistas = data;
        this.errorMessage = '';
        console.log('Artistas carregados:', this.artistas);
      },
      error: (error) => {
        console.error('Erro ao carregar artistas:', error);
        this.errorMessage = 'Não foi possível carregar os artistas. Verifique se o backend está rodando e o CORS configurado.';
      }
    });
  }

  handleRefresh(event: any) {
    this.carregarArtistas();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  editarArtista(id: number) {
    this.router.navigate(['/artist-form', id]);
  }

  async confirmarExclusao(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este artista? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluirArtista(id);
          },
        },
      ],
    });

    await alert.present();
  }

  excluirArtista(id: number) {
    this.apiService.deleteArtista(id).subscribe({
      next: () => {
        this.presentToast('Artista excluído com sucesso!', 'success');
        this.carregarArtistas();
      },
      error: (error) => {
        console.error('Erro ao excluir artista:', error);
        this.presentToast('Erro ao excluir artista.', 'danger');
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