import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarServicosTi } from '../api/novatecktiApi';
import { ApiError } from '../api/http';
import { AppShell } from '../components/AppShell';
import { YOUTUBE_EMBED_URL } from '../constants/media';
import { useAuth } from '../context/AuthContext';
import type { ServicoTi } from '../types/api';
import { formatarMoeda } from '../utils/dateUtils';

const ICONES_SERVICO: Record<string, string> = {
  'Suporte Técnico': 'support_agent',
  'Desenvolvimento de Sistemas': 'code',
  'Consultoria em TI': 'computer',
  'Manutenção Preventiva': 'build',
  'Segurança da Informação': 'security',
};

function iconeDoServico(nome: string): string {
  return ICONES_SERVICO[nome] || 'miscellaneous_services';
}

const FUNDADORES = [
  { img: 'ana.png', nome: 'Ana Souza', cargo: 'CEO', cv: 'Especialista em inovação e gestão tecnológica.' },
  { img: 'lucas.png', nome: 'Lucas Pereira', cargo: 'CTO', cv: 'Arquiteto de sistemas e desenvolvedor.' },
  { img: 'mariana.png', nome: 'Mariana Lima', cargo: 'COO', cv: 'Responsável por operações e eficiência.' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const base = process.env.PUBLIC_URL;
  const [servicos, setServicos] = useState<ServicoTi[]>([]);
  const [erroServicos, setErroServicos] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarServicos() {
      try {
        const resposta = await listarServicosTi();
        if (!ativo) return;
        if (resposta.status === 'SUCESSO' && resposta.servicos) {
          setServicos(resposta.servicos);
          setErroServicos('');
          return;
        }
        setErroServicos(resposta.mensagem || 'Não foi possível carregar os serviços.');
      } catch (error) {
        if (!ativo) return;
        setErroServicos(
          error instanceof ApiError
            ? error.message
            : 'Serviços indisponíveis. Verifique se o backend está em execução.'
        );
      }
    }

    carregarServicos();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <AppShell>
      <main className="app-page home-page">
        <section className="intro card-surface">
          <h1 className="section-title-accent">Bem-vindo à NovaTech TI</h1>
          <p>
            A <strong>NovaTech TI</strong> é uma empresa criada com o propósito de
            oferecer soluções tecnológicas modernas e acessíveis para pessoas e
            empresas que buscam se adaptar ao mundo digital. Fundada com foco em
            inovação, a empresa surgiu da ideia de conectar tecnologia e
            praticidade, oferecendo serviços como suporte técnico, desenvolvimento
            de sistemas e consultoria em TI.
          </p>
          <nav className="quick-links" aria-label="Links rápidos">
            {!isAuthenticated && (
              <>
                <Link to="/login" className="link-pill">
                  Login de clientes
                </Link>
                <Link to="/cadastro" className="link-pill">
                  Cadastrar novo cliente
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Link to="/servicos" className="link-pill">
                Solicitação de serviços de TI
              </Link>
            )}
          </nav>
        </section>

        <section className="history">
          <div className="images">
            {[1, 2, 3, 4].map((n) => (
              <img
                key={n}
                src={`${base}/assets/imagens/imagem0${n}.png`}
                alt={`Instalações NovaTech TI ${n}`}
              />
            ))}
          </div>
          <div className="media card-surface">
            <div className="video-container">
              <iframe
                title="Vídeo institucional NovaTech TI"
                src={YOUTUBE_EMBED_URL}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="services">
          <h2 className="section-title-accent">Nossos Serviços</h2>
          {erroServicos && <p className="home-services-erro">{erroServicos}</p>}
          {!erroServicos && servicos.length === 0 && (
            <p>Carregando serviços...</p>
          )}
          <div className="services-grid">
            {servicos.map((s) => (
              <article key={s.id} className="service-card">
                <span className="material-icons">{iconeDoServico(s.nome)}</span>
                <h3>{s.nome}</h3>
                <p>
                  A partir de {formatarMoeda(s.preco)} · prazo de {s.prazoDias}{' '}
                  dia(s)
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="fundadores">
          <h2 className="section-title-accent">Fundadores</h2>
          <table className="tabela-fundadores">
            <tbody>
              <tr>
                {FUNDADORES.map((f) => (
                  <td key={f.nome}>
                    <img src={`${base}/assets/imagens/${f.img}`} alt={f.nome} />
                  </td>
                ))}
              </tr>
              <tr className="nome-fundador">
                {FUNDADORES.map((f) => (
                  <td key={f.nome}>{f.nome}</td>
                ))}
              </tr>
              <tr className="cargo-fundador">
                {FUNDADORES.map((f) => (
                  <td key={f.nome}>{f.cargo}</td>
                ))}
              </tr>
              <tr>
                {FUNDADORES.map((f) => (
                  <td key={f.nome}>{f.cv}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </AppShell>
  );
}
