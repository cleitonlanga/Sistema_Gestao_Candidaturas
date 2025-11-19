import Candidatura from '../models/candidatura.models.js';

class CandidaturaController {
  
  // Listar todas as candidaturas
  async index(req, res) {
    try {
      const candidaturas = await Candidatura.findAll({
        order: [['dataCandidatura', 'DESC']]
      });
      res.json(candidaturas);
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar candidaturas',
        message: error.message 
      });
    }
  }

  // Buscar candidatura por ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const candidatura = await Candidatura.findByPk(id);
      
      if (!candidatura) {
        return res.status(404).json({ error: 'Candidatura não encontrada' });
      }
      
      res.json(candidatura);
    } catch (error) {
      console.error('Erro ao buscar candidatura:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar candidatura',
        message: error.message 
      });
    }
  }

  // Criar nova candidatura
  async store(req, res) {
    try {
      const { empresa, vaga, dataCandidatura, status, salario, plataforma, observacoes } = req.body;
      
      const candidatura = await Candidatura.create({
        empresa,
        vaga,
        dataCandidatura,
        status,
        salario,
        plataforma,
        observacoes
      });
      
      res.status(201).json(candidatura);
    } catch (error) {
      console.error('Erro ao criar candidatura:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Erro de validação',
          messages: error.errors.map(e => e.message)
        });
      }
      
      res.status(500).json({ 
        error: 'Erro ao criar candidatura',
        message: error.message 
      });
    }
  }

  // Atualizar candidatura
  async update(req, res) {
    try {
      const { id } = req.params;
      const { empresa, vaga, dataCandidatura, status, salario, plataforma, observacoes } = req.body;
      
      const candidatura = await Candidatura.findByPk(id);
      
      if (!candidatura) {
        return res.status(404).json({ error: 'Candidatura não encontrada' });
      }
      
      await candidatura.update({
        empresa,
        vaga,
        dataCandidatura,
        status,
        salario,
        plataforma,
        observacoes
      });
      
      res.json(candidatura);
    } catch (error) {
      console.error('Erro ao atualizar candidatura:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Erro de validação',
          messages: error.errors.map(e => e.message)
        });
      }
      
      res.status(500).json({ 
        error: 'Erro ao atualizar candidatura',
        message: error.message 
      });
    }
  }

  // Deletar candidatura
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const candidatura = await Candidatura.findByPk(id);
      
      if (!candidatura) {
        return res.status(404).json({ error: 'Candidatura não encontrada' });
      }
      
      await candidatura.destroy();
      res.json({ message: 'Candidatura removida com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar candidatura:', error);
      res.status(500).json({ 
        error: 'Erro ao deletar candidatura',
        message: error.message 
      });
    }
  }

  // Estatísticas
  async stats(req, res) {
    try {
      const total = await Candidatura.count();
      
      const emAndamento = await count({
        where: {
          status: ['Enviada', 'Em Análise', 'Entrevista Agendada', 'Aguardando Retorno']
        }
      });
      
      const aprovadas = await count({
        where: { status: 'Aprovada' }
      });
      
      const rejeitadas = await count({
        where: { status: 'Rejeitada' }
      });
      
      res.json({
        total,
        emAndamento,
        aprovadas,
        rejeitadas
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar estatísticas',
        message: error.message 
      });
    }
  }
}

export default new CandidaturaController();
