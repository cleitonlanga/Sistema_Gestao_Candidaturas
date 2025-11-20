import app from './app.js';
import { client } from './DB/config.js';
import { criarTabelaCandidaturas } from './models/candidatura.models.js';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
dotenv.config();

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
   
    if (!client._connected) {
      await client.connect();
      console.log('✓ Conexão com o banco de dados estabelecida com sucesso!');
    }
    
    // Criar tabela se não existir
    await criarTabelaCandidaturas();
    
    // Para Vercel, não usar app.listen()
    // Apenas exportar o app
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('✗ Erro ao iniciar servidor:', error);
  }
};

iniciarServidor();

