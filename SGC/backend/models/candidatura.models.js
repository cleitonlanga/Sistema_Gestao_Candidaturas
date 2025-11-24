// models/Candidatura.js
import { client } from '../DB/config.js';

export const criarTabelaCandidaturas = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS candidaturas (
      id SERIAL PRIMARY KEY,
      empresa VARCHAR(255) NOT NULL,
      vaga VARCHAR(255) NOT NULL,
      data_candidatura DATE NOT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('Enviada', 'Em Análise', 'Entrevista Agendada', 'Aguardando Retorno', 'Aprovada', 'Rejeitada')),
      salario VARCHAR(100),
      plataforma VARCHAR(100) NOT NULL CHECK (plataforma IN ('LinkedIn', 'Link externo', 'Outro')),
      link_plataforma VARCHAR(255),
      observacoes TEXT,
      data_criacao TIMESTAMP DEFAULT NOW(),
      data_atualizacao TIMESTAMP DEFAULT NOW()
    );
  `;

  await client.query(query);
  console.log('✓ Tabela candidaturas criada ou já existente.');
};
