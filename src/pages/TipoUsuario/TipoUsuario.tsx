import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { TipoUsuario } from "../../types/api";
import { getApiErrorMessage } from "../../services/api";
import { tipoUsuarioService } from "../../services/eventPlusservice";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Campo from "../../components/campo/Campo";
import Botao from "../../components/botao/Botao";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";
import lapis from "../../assets/icons/lapis.svg";
import lixeira from "../../assets/icons/lixeira.svg";
import "./TipoUsuario.css";

function TipoUsuarioPage() {
    const [tipos, setTipos] = useState<TipoUsuario[]>([]);
    const [titulo, setTitulo] = useState("");
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<TipoUsuario | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        try {
            setTipos(await tipoUsuarioService.listar());
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
            if (idEmEdicao) await tipoUsuarioService.atualizar(idEmEdicao, valor);
            else await tipoUsuarioService.cadastrar(valor);
            limpar();
            await carregar();
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
        } finally {
            setEnviando(false);
        }
    }

    function editar(tipo: TipoUsuario) {
        setTitulo(tipo.titulo);
        setIdEmEdicao(tipo.idTipoUsuario);
        setMensagem("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado) return;
        setEnviando(true);
        try {
            await tipoUsuarioService.excluir(selecionado.idTipoUsuario);
            if (idEmEdicao === selecionado.idTipoUsuario) limpar();
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
            <main className="tipo-usuario-page">
                <section className="tipo-usuario-form-section">
                    <h1 className="tipo-usuario-titulo-secao">Administração tipo de usuários</h1>
                    <div className="tipo-usuario-form-conteudo">
                        <div className="tipo-usuario-ilustracao" aria-hidden="true">
                            <div className="tipo-usuario-janela"><span /><span /><span /><i /><i /><i /></div>
                            <div className="tipo-usuario-avatar"><span className="tipo-usuario-cabelo" /><span className="tipo-usuario-rosto" /><span className="tipo-usuario-corpo" /></div>
                            <span className="tipo-usuario-mais">+</span>
                        </div>
                        <form className="tipo-usuario-form" onSubmit={salvar}>
                            <label className="visually-hidden" htmlFor="tipo-usuario-titulo">Título do tipo de usuário</label>
                            <Campo id="tipo-usuario-titulo" name="titulo" value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder="Título" maxLength={80} required />
                            <Botao texto={enviando ? "Salvando..." : idEmEdicao ? "Salvar alterações" : "Cadastrar"} type="submit" disabled={enviando} />
                            {idEmEdicao && <button className="tipo-usuario-cancelar" type="button" onClick={limpar}>Cancelar edição</button>}
                            {mensagem && <p className="tipo-usuario-mensagem" role="alert">{mensagem}</p>}
                        </form>
                    </div>
                </section>
                <section className="tipo-usuario-lista" aria-labelledby="tipo-usuario-lista-titulo">
                    <h2 id="tipo-usuario-lista-titulo" className="tipo-usuario-titulo-secao">Lista tipo de usuários</h2>
                    <div className="tipo-usuario-tabela-wrap">
                        <table className="tipo-usuario-tabela">
                            <thead><tr><th scope="col">Título</th><th scope="col">Editar</th><th scope="col">Deletar</th></tr></thead>
                            <tbody>
                                {carregando ? <tr><td colSpan={3}>Carregando tipos de usuário...</td></tr> : tipos.length === 0 ? <tr><td colSpan={3}>Nenhum tipo de usuário cadastrado.</td></tr> : tipos.map((tipo) => (
                                    <tr key={tipo.idTipoUsuario}>
                                        <td>{tipo.titulo}</td>
                                        <td><button className="tipo-usuario-acao" type="button" onClick={() => editar(tipo)} aria-label={`Editar ${tipo.titulo}`}><img src={lapis} alt="" /></button></td>
                                        <td><button className="tipo-usuario-acao" type="button" onClick={() => setSelecionado(tipo)} aria-label={`Excluir ${tipo.titulo}`}><img src={lixeira} alt="" /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            <Footer />
            <ModalConfirmacao show={Boolean(selecionado)} titulo="Excluir tipo de usuário" mensagem={selecionado ? `Deseja excluir o tipo "${selecionado.titulo}"?` : ""} textoConfirmar={enviando ? "Excluindo..." : "Excluir"} textoCancelar="Cancelar" onClose={() => setSelecionado(null)} onConfirm={() => void excluir()} />
        </>
    );
}

export default TipoUsuarioPage;
