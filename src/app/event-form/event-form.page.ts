// cultural_events_app/src/app/event-form/event-form.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importe ReactiveFormsModule
import { ActivatedRoute, Router } from '@angular/router'; // Importe ActivatedRoute e Router
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common'; // Importe CommonModule
import { IonicModule, ToastController } from '@ionic/angular'; // Importe IonicModule e ToastController
import { EventoCultural } from '../models/evento-cultural.model'; // Vamos criar este modelo em seguida

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.page.html',
  styleUrls: ['./event-form.page.scss'],
  standalone: true, // Se o projeto for standalone, isso é necessário
  imports: [IonicModule, CommonModule, ReactiveFormsModule] // Imports para standalone components
})
export class EventFormPage implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventoId: number | null = null;
  // Choices para o formulário (precisam ser mapeadas para as do Django)
  categorias = [
    { value: 'MUSICA', label: 'Música' },
    { value: 'TEATRO', label: 'Teatro' },
    { value: 'DANCA', label: 'Dança' },
    { value: 'ARTES_VISUAIS', label: 'Artes Visuais' },
    { value: 'GASTRONOMIA', label: 'Gastronomia' },
    { value: 'FEIRA', label: 'Feira' },
    { value: 'OUTRO', label: 'Outro' },
  ];
  statusChoices = [
    { value: 'AGENDADO', label: 'Agendado' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute, // Para obter parâmetros da rota (ID do evento)
    private router: Router,       // Para navegar após salvar/deletar
    private toastController: ToastController // Para exibir mensagens ao usuário
  ) {
    this.eventForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      data_hora_inicio: ['', Validators.required],
      data_hora_termino: ['', Validators.required],
      local: ['', Validators.required],
      endereco: ['', Validators.required],
      cidade: ['Palmas', Validators.required],
      estado: ['TO', Validators.required],
      categoria: ['OUTRO', Validators.required],
      ingresso_gratuito: [true],
      preco_ingresso: [null],
      link_compra_ingresso: [''],
      contato_duvidas: [''],
      status: ['AGENDADO', Validators.required]
    });
  }

  ngOnInit() {
    // Verifica se estamos em modo de edição
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventoId) {
      this.isEditMode = true;
      this.apiService.getEvento(this.eventoId).subscribe({
        next: (evento) => {
          // Formatar datas para o formato do input datetime-local
          if (evento.data_hora_inicio) {
            evento.data_hora_inicio = new Date(evento.data_hora_inicio).toISOString().slice(0, 16);
          }
          if (evento.data_hora_termino) {
            evento.data_hora_termino = new Date(evento.data_hora_termino).toISOString().slice(0, 16);
          }
          this.eventForm.patchValue(evento);
        },
        error: (error) => {
          console.error('Erro ao carregar evento para edição:', error);
          this.presentToast('Erro ao carregar evento para edição.', 'danger');
          this.router.navigate(['/tabs/tab1']); // Volta para a lista se der erro
        }
      });
    }

    // Lógica para desabilitar/habilitar preco_ingresso
    this.eventForm.get('ingresso_gratuito')?.valueChanges.subscribe(gratuito => {
      if (gratuito) {
        this.eventForm.get('preco_ingresso')?.disable();
        this.eventForm.get('preco_ingresso')?.setValue(null); // Limpa o valor
      } else {
        this.eventForm.get('preco_ingresso')?.enable();
      }
    });
    // Garante o estado inicial do campo preco_ingresso
    if (this.eventForm.get('ingresso_gratuito')?.value) {
      this.eventForm.get('preco_ingresso')?.disable();
    }
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }

  async onSubmit() {
    if (this.eventForm.valid) {
      const eventoData = { ...this.eventForm.value };

      // Ajusta o formato da data para o Django (ISO 8601 com 'Z' para UTC)
      if (eventoData.data_hora_inicio) {
        eventoData.data_hora_inicio = new Date(eventoData.data_hora_inicio).toISOString();
      }
      if (eventoData.data_hora_termino) {
        eventoData.data_hora_termino = new Date(eventoData.data_hora_termino).toISOString();
      }

      let request;
      if (this.isEditMode && this.eventoId) {
        request = this.apiService.updateEvento(this.eventoId, eventoData);
      } else {
        request = this.apiService.createEvento(eventoData);
      }

      request.subscribe({
        next: () => {
          this.presentToast(`Evento ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`, 'success');
          this.router.navigate(['/tabs/tab1']); // Redireciona para a lista de eventos
        },
        error: (error) => {
          console.error('Erro ao salvar evento:', error);
          this.presentToast(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} evento.`, 'danger');
        }
      });
    } else {
      this.presentToast('Por favor, preencha todos os campos obrigatórios corretamente.', 'warning');
      this.eventForm.markAllAsTouched(); // Marca todos os campos como "tocados" para exibir erros
    }
  }
}