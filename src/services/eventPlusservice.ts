import { axiosInstance } from "./api";

import type { instituicao, Comentario, ComentarioPayload, Evento, LoginPayload, LoginResponse, MensagemModeracao, Presenca, PresencaPayload, TipoEvento, TipoUsuario, Usuario, UsuarioPayload } from "../types/api";

function eventFormData(payload: EventoPayload){
    const formData = new FormData();
    formData.append("Nome", payload.nome);
    formData.append("descricao", payload.descricao);
    formData.append("dataEvento", payload.dataEvento);
    formData.append("idTipoEvento", payload.idTipoEvento);
    formData.append("idInstituicao", payload.idInstituicao);
    if(payload.arquivoImagem) FormData.append("ArquivoImagem", payload.arquivoImagem);
    if(payload.imagemUrl) FormData.append("ImagemUrl", payload.imagemUrl);
    return formData
}

export const authService = {
    async login(payload: LoginPayload) {
        const { data } = await axiosInstance.post<LoginResponse>("Login", payload);
        return data;
    }
}

export const eventoService = {

    async listar(){
        const { data } = await axiosInstance.get<Evento[]>("Evento")
        return data;
    },

    async listarProximos() {
        const { data } = await axiosInstance.get<Evento[]>("Evento/proximos");
        return data;
    },

    async buscar(id: string){
        const { data } = await axiosInstance.get<Evento>(`Evento/${id}`);
        return data;
    }
}

export const comentarioService = {
    async listarPorEvento(idEvento: string){
        const { data } = await axiosInstance.get<Comentario[]>(`Comentario/evento/${idEvento}`);
        return data
    },

    async cadastrar(payload: ComentarioPayload){
        const { data } = await axiosInstance.post<Comentario | MensagemModeracao>(
            "Comentario",
            payload
        );
        return data;
    }
}

export const presencaService = {
    async listarPorUsuario(idUsuario: string){
        const { data } = await axiosInstance.get<Presenca[]>(`Presenca/usuario/${idUsuario}`);
        return data;
    },

    async cadastrar(payload: PresencaPayload) {
        const { data } = await axiosInstance.post<Presenca>("/Presenca", payload);
        return data;
    },

    async excluir(id: string){
        await axiosInstance.delete(`Presenca/${id}`);
    }
}

export const usuarioService = {

    async listar(){
        const { data } = await axiosInstance.get<Usuario[]>("Usuario");
        return data;
    },

    async buscar(id:string){
        const { data } = await axiosInstance.get<Usuario>(`Usuario/${id}`);
        return data;
    },

    async cadastrar(payload: UsuarioPayload){
        const { data } = await axiosInstance.post<Usuario>("Usuario", payload);
        return data;
    },

    async atualizar(id: string, payload: UsuarioPayload){
        await axiosInstance.put(`Usuario/${id}`, payload);
    },

    async excluir(id: string){
        await axiosInstance.delete(`Usuario/${id}`);
    }
}

function tipoService<T extends { titulo: string}>(endpoint:string){
    return {
        async listar(){
            const { data } = await axiosInstance.get<T[]>(endpoint);
            return data;
        },
        async cadastrar(titulo: string){
            const { data } = await axiosInstance.post<T>(endpoint, { titulo });
            return data;
        },
        async atualizar(id: string, titulo: string){
            await axiosInstance.put(`${endpoint}/${id}`, {titulo});
        },
        async excluir(id: string){
            await axiosInstance.delete(`${endpoint}/${id}`)
        }
    }
}

export const tipoUsuarioService = tipoService<TipoUsuario>("TipoUsuario")
export const tipoEventoService = tipoService<TipoEvento>("TipoEvento")

export const instituicaoService = {
    async listar() {
        const { data } = await axiosInstance.get<instituicao[]>
        ("Instituicao");
        return data;
    }
}