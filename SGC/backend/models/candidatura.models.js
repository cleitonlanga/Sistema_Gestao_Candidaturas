import { DataTypes } from 'sequelize';
import { sequelize } from '../DB/config.js';


const Candidatura = sequelize.define('Candidatura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  empresa: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome da empresa é obrigatório' }
    }
  },
  vaga: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome da vaga é obrigatório' }
    }
  },
  dataCandidatura: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_candidatura',
    validate: {
      isDate: { msg: 'Data inválida' }
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Enviada', 'Em Análise', 'Entrevista Agendada', 'Aguardando Retorno', 'Aprovada', 'Rejeitada']],
        msg: 'Status inválido'
      }
    }
  },
  salario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  plataforma: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'candidaturas',
  timestamps: true,
  createdAt: 'data_criacao',
  updatedAt: 'data_atualizacao'
});

export default Candidatura;
