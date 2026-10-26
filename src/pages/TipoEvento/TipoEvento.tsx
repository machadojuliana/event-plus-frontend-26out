import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { TipoEvento as TipoEventoType } from "../../types/api";
import { getApiErrorMessage } from "../../services/api";
import { tipoEventoService } from "../../services/eventPlusservice";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Campo from "../../components/campo/Campo";
import Botao from "../../components/botao/Botao";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";
import lapis from "../../assets/icons/lapis.svg";
import lixeira from "../../assets/icons/lixeira.svg";
import "./TipoEvento.css";

function TipoEvento() {
    const [tipos, setTipos] = useState<TipoEventoType[]>([]);
    const [titulo, setTitulo] = useState("");
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<TipoEventoType | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        try {
            setTipos(await tipoEventoService.listar());
            setMensagem("");
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregar(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    function limpar() {
        setTitulo("");
        setIdEmEdicao(null);
        setMensagem("");
    }

    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const valor = titulo.trim();
        if (!valor) return;
        setEnviando(true);
        setMensagem("");
        try {
            if (idEmEdicao) await tipoEventoService.atualizar(idEmEdicao, valor);
            else await tipoEventoService.cadastrar(valor);
            limpar();
            await carregar();
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
        } finally {
            setEnviando(false);
        }
    }

    function editar(tipo: TipoEventoType) {
        setTitulo(tipo.titulo);
        setIdEmEdicao(tipo.idTipoEvento);
        setMensagem("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado) return;
        setEnviando(true);
        try {
            await tipoEventoService.excluir(selecionado.idTipoEvento);
            if (idEmEdicao === selecionado.idTipoEvento) limpar();
            setSelecionado(null);
            await carregar();
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
            setSelecionado(null);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <>
            <Header />
            <main className="tipo-evento-page">
                <section className="tipo-evento-form-section">
                    <h1 className="tipo-evento-titulo-secao">Administração tipo de eventos</h1>
                    <div className="tipo-evento-form-conteudo">
                        <div className="tipo-evento-ilustracao" aria-hidden="true">
                            <div className="tipo-evento-monitor">
                                <div className="tipo-evento-tela"><i /><i /><i /><i /></div>
                                <div className="tipo-evento-base" />
                            </div>
                            <span className="tipo-evento-pessoa tipo-evento-pessoa-um"><i /><b /></span>
                            <span className="tipo-evento-pessoa tipo-evento-pessoa-dois"><i /><b /></span>
                            <span className="tipo-evento-mais">+</span>
                        </div>
                        <form className="tipo-evento-form" onSubmit={salvar}>
                            <label className="visually-hidden" htmlFor="tipo-evento-titulo">Título do tipo de evento</label>
                            <Campo id="tipo-evento-titulo" name="titulo" value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder="Título" maxLength={80} required />
                            <Botao texto={enviando ? "Salvando..." : idEmEdicao ? "Salvar alterações" : "Cadastrar"} type="submit" disabled={enviando} />
                            {idEmEdicao && <button className="tipo-evento-cancelar" type="button" onClick={limpar}>Cancelar edição</button>}
                            {mensagem && <p className="tipo-evento-mensagem" role="alert">{mensagem}</p>}
                        </form>
                    </div>
                </section>
                <section className="tipo-evento-lista" aria-labelledby="tipo-evento-lista-titulo">
                    <h2 id="tipo-evento-lista-titulo" className="tipo-evento-titulo-secao">Lista tipo de eventos</h2>
                    <div className="tipo-evento-tabela-wrap">
                        <table className="tipo-evento-tabela">
                            <thead><tr><th scope="col">Título</th><th scope="col">Editar</th><th scope="col">Deletar</th></tr></thead>
                            <tbody>
                                {carregando ? <tr><td colSpan={3}>Carregando tipos de evento...</td></tr> : tipos.length === 0 ? <tr><td colSpan={3}>Nenhum tipo de evento cadastrado.</td></tr> : tipos.map((tipo) => (
                                    <tr key={tipo.idTipoEvento}>
                                        <td>{tipo.titulo}</td>
                                        <td><button className="tipo-evento-acao" type="button" onClick={() => editar(tipo)} aria-label={`Editar ${tipo.titulo}`}><img src={lapis} alt="" /></button></td>
                                        <td><button className="tipo-evento-acao" type="button" onClick={() => setSelecionado(tipo)} aria-label={`Excluir ${tipo.titulo}`}><img src={lixeira} alt="" /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            <Footer />
            <ModalConfirmacao show={Boolean(selecionado)} titulo="Excluir tipo de evento" mensagem={selecionado ? `Deseja excluir o tipo "${selecionado.titulo}"?` : ""} textoConfirmar={enviando ? "Excluindo..." : "Excluir"} textoCancelar="Cancelar" onClose={() => setSelecionado(null)} onConfirm={() => void excluir()} />
        </>
    );
}

export default TipoEvento;
