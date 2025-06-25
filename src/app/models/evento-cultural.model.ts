// cultural_events_app/src/app/models/evento-cultural.model.ts

export interface EventoCultural {
    id?: number; // Opcional, pois é gerado pelo backend
    nome: string;
    descricao?: string;
    data_hora_inicio: string; // Usar string para datas ISO
    data_hora_termino: string; // Usar string para datas ISO
    local: string;
    endereco: string;
    cidade?: string;
    estado?: string;
    categoria?: string;
    ingresso_gratuito?: boolean;
    preco_ingresso?: number | null;
    link_compra_ingresso?: string;
    contato_duvidas?: string;
    status?: string;
}