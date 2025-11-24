import app from './app.js';
import { client, testarConexao } from './DB/config.js';
import { criarTabelaCandidaturas } from './models/candidatura.models.js';
import dotenv from 'dotenv';

dotenv.config();

// Railway define PORT automaticamente
const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    console.log('🚂 Iniciando aplicação no Railway...');
    console.log('🔌 Ambiente:', process.env.NODE_ENV);
    console.log('📡 Porta:', PORT);
    
    // Testar conexão com banco
    console.log('🔄 Testando conexão com PostgreSQL...');
    const conectado = await testarConexao();
    
    if (!conectado) {
      throw new Error('Falha ao conectar com PostgreSQL');
    }
    
    // Criar tabelas
    console.log('📦 Criando/verificando tabelas...');
    await criarTabelaCandidaturas();
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Acesse: http://localhost:${PORT}`);
      if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        console.log(`🚀 URL Pública: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Tratamento de sinais
process.on('SIGTERM', async () => {
  console.log('📥 SIGTERM recebido, encerrando...');
  await client.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📥 SIGINT recebido, encerrando...');
  await client.end();
  process.exit(0);
});

iniciarServidor();