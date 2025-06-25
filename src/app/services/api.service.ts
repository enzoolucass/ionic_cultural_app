// cultural_events_app/src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoCultural } from '../models/evento-cultural.model';
import { ArtistaGrupoMusical } from '../models/artista-grupo-musical.model'; // <-- NOVA IMPORTAÇÃO AQUI

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_BASE_URL = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  // Métodos para Eventos Culturais (SEM MUDANÇAS AQUI)
  getEventos(): Observable<EventoCultural[]> {
    return this.http.get<EventoCultural[]>(`${this.API_BASE_URL}eventos/`);
  }

  getEvento(id: number): Observable<EventoCultural> {
    return this.http.get<EventoCultural>(`${this.API_BASE_URL}eventos/${id}/`);
  }

  createEvento(evento: EventoCultural): Observable<EventoCultural> {
    return this.http.post<EventoCultural>(`${this.API_BASE_URL}eventos/`, evento);
  }

  updateEvento(id: number, evento: EventoCultural): Observable<EventoCultural> {
    return this.http.put<EventoCultural>(`${this.API_BASE_URL}eventos/${id}/`, evento);
  }

  deleteEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_BASE_URL}eventos/${id}/`);
  }

  // Métodos para Artistas/Grupos Musicais (TIPAGEM ATUALIZADA AQUI)
  getArtistas(): Observable<ArtistaGrupoMusical[]> { // <-- ATUALIZADO
    return this.http.get<ArtistaGrupoMusical[]>(`${this.API_BASE_URL}artistas/`);
  }

  getArtista(id: number): Observable<ArtistaGrupoMusical> { // <-- ATUALIZADO
    return this.http.get<ArtistaGrupoMusical>(`${this.API_BASE_URL}artistas/${id}/`);
  }

  createArtista(artista: ArtistaGrupoMusical): Observable<ArtistaGrupoMusical> { // <-- ATUALIZADO
    return this.http.post<ArtistaGrupoMusical>(`${this.API_BASE_URL}artistas/`, artista);
  }

  updateArtista(id: number, artista: ArtistaGrupoMusical): Observable<ArtistaGrupoMusical> { // <-- ATUALIZADO
    return this.http.put<ArtistaGrupoMusical>(`${this.API_BASE_URL}artistas/${id}/`, artista);
  }

  deleteArtista(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_BASE_URL}artistas/${id}/`);
  }
}