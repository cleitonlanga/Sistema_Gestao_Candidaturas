import { client } from '../DB/config.js';

class CandidaturaController {

  // Listar todas as candidaturas
  async index(req, res) {
    try {
      const result = await client.query(
        'SELECT * FROM candidaturas ORDER BY data_candidatura DESC'
      );
      res.json(result.rows);
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
      const result = await client.query(
        'SELECT * FROM candidaturas WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Candidatura não encontrada' });
      }

      res.json(result.rows[0]);
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

      const result = await client.query(
        `INSERT INTO candidaturas 
          (empresa, vaga, data_candidatura, status, salario, plataforma, observacoes) 
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
        [empresa, vaga, dataCandidatura, status, salario, plataforma, observacoes]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar candidatura:', error);
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

      const result = await client.query(
        `UPDATE candidaturas
         SET empresa=$1, vaga=$2, data_candidatura=$3, status=$4, salario=$5, plataforma=$6, observacoes=$7, data_atualizacao=NOW()
         WHERE id=$8
         RETURNING *`,
        [empresa, vaga, dataCandidatura, status, salario, plataforma, observacoes, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Candidatura não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar candidatura:', error);
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

      const result = await client.query(
        'DELETE FROM candidaturas WHERE id=$1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Candidatura não encontrada' });
      }

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
      const totalResult = await client.query('SELECT COUNT(*) FROM candidaturas');
      const emAndamentoResult = await client.query(
        `SELECT COUNT(*) FROM candidaturas 
         WHERE status IN ('Enviada', 'Em Análise', 'Entrevista Agendada', 'Aguardando Retorno')`
      );
      const aprovadasResult = await client.query(
        "SELECT COUNT(*) FROM candidaturas WHERE status='Aprovada'"
      );
      const rejeitadasResult = await client.query(
        "SELECT COUNT(*) FROM candidaturas WHERE status='Rejeitada'"
      );

      res.json({
        total: parseInt(totalResult.rows[0].count),
        emAndamento: parseInt(emAndamentoResult.rows[0].count),
        aprovadas: parseInt(aprovadasResult.rows[0].count),
        rejeitadas: parseInt(rejeitadasResult.rows[0].count)
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
