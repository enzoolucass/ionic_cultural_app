// cultural_events_app/src/app/models/artista-grupo-musical.model.ts

export interface ArtistaGrupoMusical {
    id?: number;
    nome: string;
    genero_musical_principal?: string;
    biografia_historico?: string;
    ano_formacao?: number | null;
    cidade_origem?: string;
    estado_origem?: string;
    link_redes_sociais?: string;
    link_canal_musica?: string;
    contato_shows?: string;
    ativo?: boolean;
}