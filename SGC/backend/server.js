// server.js
import app from './app.js';
import { client } from './DB/config.js';
import { criarTabelaCandidaturas } from './models/candidatura.models.js';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first'); // força Node a usar IPv4


dotenv.config();
const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await client.connect();
    console.log('✓ Conexão com o banco de dados estabelecida com sucesso!');

    // Criar tabela se não existir
    await criarTabelaCandidaturas();

    app.listen(PORT, () => {
      console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();
