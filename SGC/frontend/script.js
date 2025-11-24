let candidaturas = [];
let editandoId = null;

// Detectar URL base automaticamente
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

console.log('API Base URL:', API_BASE_URL);

const statusOptions = [
  'Enviada',
  'Em Análise',
  'Entrevista Agendada',
  'Aguardando Retorno',
  'Aprovada',
  'Rejeitada'
];

document.addEventListener('DOMContentLoaded', () => {
  carregarCandidaturas();
  carregarEstatisticas();
  document.getElementById('dataCandidatura').valueAsDate = new Date();
  
  // Fechar dropdowns ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.status-dropdown')) {
      document.querySelectorAll('.status-options').forEach(el => {
        el.classList.remove('show');
        const badge = el.previousElementSibling;
        if (badge) badge.classList.remove('active');
      });
    }
  });
});

document.getElementById('candidaturaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const candidatura = {
    empresa: document.getElementById('empresa').value,
    vaga: document.getElementById('vaga').value,
    dataCandidatura: document.getElementById('dataCandidatura').value,
    status: document.getElementById('status').value,
    salario: document.getElementById('salario').value || null,
    plataforma: document.getElementById('plataforma').value || null,
    link_plataforma: document.getElementById('link_plataforma').value || null,
    observacoes: document.getElementById('observacoes').value || null
  };

  if (editandoId) {
    await atualizarCandidatura(editandoId, candidatura);
    editandoId = null;
    document.querySelector('.form-section h2').textContent = 'Nova Candidatura';
  } else {
    await adicionarCandidatura(candidatura);
  }

  document.getElementById('candidaturaForm').reset();
  document.getElementById('dataCandidatura').valueAsDate = new Date();
});

async function carregarCandidaturas() {
  try {
    console.log('Carregando candidaturas de:', `${API_BASE_URL}/candidaturas`);
    
    const response = await fetch(`${API_BASE_URL}/candidaturas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', response.status, errorText);
      throw new Error(`Erro ao carregar candidaturas: ${response.status}`);
    }
    
    candidaturas = await response.json();
    console.log('Candidaturas carregadas:', candidaturas.length);
    renderizarCandidaturas();
  } catch (error) {
    console.error('Erro ao carregar candidaturas:', error);
    document.getElementById('listaCandidaturas').innerHTML = `
      <div class="empty-state">
        <h3>⚠️ Erro ao carregar candidaturas</h3>
        <p>${error.message}</p>
        <p>Verifique o console para mais detalhes.</p>
      </div>
    `;
  }
}

async function carregarEstatisticas() {
  try {
    const response = await fetch(`${API_BASE_URL}/candidaturas/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao carregar estatísticas');
    }
    
    const stats = await response.json();
    document.getElementById('totalCandidaturas').textContent = stats.total || 0;
    document.getElementById('emAndamento').textContent = stats.emAndamento || 0;
    document.getElementById('aprovadas').textContent = stats.aprovadas || 0;
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
    // Manter zeros em caso de erro
    document.getElementById('totalCandidaturas').textContent = '0';
    document.getElementById('emAndamento').textContent = '0';
    document.getElementById('aprovadas').textContent = '0';
  }
}

async function adicionarCandidatura(candidatura) {
  try {
    console.log('Adicionando candidatura:', candidatura);
    
    const response = await fetch(`${API_BASE_URL}/candidaturas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(candidatura)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Erro ao adicionar candidatura');
    }
    
    const novaCandidatura = await response.json();
    console.log('Candidatura adicionada:', novaCandidatura);
    
    await carregarCandidaturas();
    await carregarEstatisticas();
    
    // Mostrar mensagem de sucesso
    alert('✅ Candidatura adicionada com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar candidatura:', error);
    alert('❌ Erro ao adicionar candidatura: ' + error.message);
  }
}

async function atualizarCandidatura(id, candidatura) {
  try {
    console.log('Atualizando candidatura:', id, candidatura);
    
    const response = await fetch(`${API_BASE_URL}/candidaturas/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(candidatura)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Erro ao atualizar candidatura');
    }
    
    const candidaturaAtualizada = await response.json();
    console.log('Candidatura atualizada:', candidaturaAtualizada);
    
    await carregarCandidaturas();
    await carregarEstatisticas();
    
    alert('✅ Candidatura atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar candidatura:', error);
    alert('❌ Erro ao atualizar candidatura: ' + error.message);
  }
}

async function alterarStatus(id, novoStatus) {
  try {
    console.log('Alterando status:', id, novoStatus);
    
    // Buscar a candidatura atual
    const candidatura = candidaturas.find(c => c.id === id);
    if (!candidatura) {
      throw new Error('Candidatura não encontrada');
    }
    
    // Atualizar apenas o status
    const candidaturaAtualizada = {
      empresa: candidatura.empresa,
      vaga: candidatura.vaga,
      dataCandidatura: candidatura.data_candidatura || candidatura.dataCandidatura,
      status: novoStatus,
      salario: candidatura.salario,
      plataforma: candidatura.plataforma,
      link_plataforma: candidatura.link_plataforma,
      observacoes: candidatura.observacoes
    };
    
    const response = await fetch(`${API_BASE_URL}/candidaturas/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(candidaturaAtualizada)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Erro ao alterar status');
    }
    
    console.log('Status alterado com sucesso');
    
    await carregarCandidaturas();
    await carregarEstatisticas();
    
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    alert('❌ Erro ao alterar status: ' + error.message);
  }
}

function toggleStatusDropdown(id) {
  const dropdown = document.getElementById(`status-options-${id}`);
  const badge = document.getElementById(`status-badge-${id}`);
  
  // Fechar outros dropdowns
  document.querySelectorAll('.status-options').forEach(el => {
    if (el !== dropdown) {
      el.classList.remove('show');
      const otherBadge = el.previousElementSibling;
      if (otherBadge) otherBadge.classList.remove('active');
    }
  });
  
  // Toggle atual
  dropdown.classList.toggle('show');
  badge.classList.toggle('active');
}

async function excluirCandidatura(id) {
  if (!confirm('Tem certeza que deseja excluir esta candidatura?')) return;
  
  try {
    console.log('Excluindo candidatura:', id);
    
    const response = await fetch(`${API_BASE_URL}/candidaturas/${id}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao excluir candidatura');
    }
    
    console.log('Candidatura excluída:', id);
    
    await carregarCandidaturas();
    await carregarEstatisticas();
    
    alert('✅ Candidatura excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir candidatura:', error);
    alert('❌ Erro ao excluir candidatura: ' + error.message);
  }
}

function editarCandidatura(id) {
  const candidatura = candidaturas.find(c => c.id === id);
  if (!candidatura) {
    alert('❌ Candidatura não encontrada');
    return;
  }

  console.log('Editando candidatura:', candidatura);

  document.getElementById('empresa').value = candidatura.empresa;
  document.getElementById('vaga').value = candidatura.vaga;
  document.getElementById('dataCandidatura').value = candidatura.data_candidatura || candidatura.dataCandidatura;
  document.getElementById('status').value = candidatura.status;
  document.getElementById('salario').value = candidatura.salario || '';
  document.getElementById('plataforma').value = candidatura.plataforma || '';
  document.getElementById('link_plataforma').value = candidatura.link_plataforma || '';
  document.getElementById('observacoes').value = candidatura.observacoes || '';

  editandoId = id;
  document.querySelector('.form-section h2').textContent = 'Editar Candidatura';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarCandidaturas() {
  const lista = document.getElementById('listaCandidaturas');
  
  if (!candidaturas || candidaturas.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <h3>📭 Nenhuma candidatura registrada</h3>
        <p>Adicione sua primeira candidatura usando o formulário acima</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = candidaturas.map(c => {
    // Normalizar nome da coluna (pode vir como data_candidatura ou dataCandidatura)
    const dataCandidatura = c.data_candidatura || c.dataCandidatura;
    
    return `
      <div class="candidatura-card">
        <div class="candidatura-header">
          <div class="candidatura-title">
            <h3>${escapeHtml(c.empresa)}</h3>
            <p>${escapeHtml(c.vaga)}</p>
          </div>
          <div class="candidatura-actions">
            <button class="btn-edit" onclick="editarCandidatura(${c.id})">✏️ Editar</button>
            <button class="btn-delete" onclick="excluirCandidatura(${c.id})">🗑️ Excluir</button>
          </div>
        </div>
        
        <div class="candidatura-details">
          <div class="detail-item">
            <span class="detail-label">Data da Candidatura</span>
            <span class="detail-value">${formatarData(dataCandidatura)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status (clique para alterar)</span>
            <div class="status-dropdown">
              <button 
                class="status-badge status-${c.status.toLowerCase().replace(/ /g, '')}"
                id="status-badge-${c.id}"
                onclick="toggleStatusDropdown(${c.id})"
                type="button"
              >
                ${escapeHtml(c.status)}
              </button>
              <div class="status-options" id="status-options-${c.id}">
                ${statusOptions.map(status => `
                  <div class="status-option" onclick="alterarStatus(${c.id}, '${status}'); toggleStatusDropdown(${c.id})">
                    ${status}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          ${c.salario ? `
            <div class="detail-item">
              <span class="detail-label">Salário Pretendido</span>
              <span class="detail-value">${escapeHtml(c.salario)}</span>
            </div>
          ` : ''}
          ${c.plataforma ? `
            <div class="detail-item">
              <span class="detail-label">Plataforma</span>
              <span class="detail-value">${escapeHtml(c.plataforma)}</span>
            </div>
          ` : ''}
        </div>
        
        ${c.link_plataforma ? `
          <div class="detail-item" style="margin-top: 10px;">
            <span class="detail-label">Link da Plataforma</span>
            <span class="detail-value"><a href="${escapeHtml(c.link_plataforma)}" target="_blank">${escapeHtml(c.link_plataforma)}</a></span>
          </div>
        ` : ''}
        
        ${c.observacoes ? `
          <div class="observacoes">
            <strong>Observações:</strong> ${escapeHtml(c.observacoes)}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function formatarData(data) {
  if (!data) return 'Data não disponível';
  
  try {
    // Adiciona T00:00:00 para garantir timezone correto
    const dataObj = new Date(data + 'T00:00:00');
    return dataObj.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return data;
  }
}

// Função para escapar HTML e prevenir XSS
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.toString().replace(/[&<>"']/g, m => map[m]);
}

// Teste de conexão ao carregar
console.log('Script carregado. Testando conexão com API...');
fetch(`${API_BASE_URL}/candidaturas/stats`)
  .then(response => {
    console.log('Status da API:', response.status);
    return response.json();
  })
  .then(data => console.log('API funcionando! Stats:', data))
  .catch(error => console.error('Erro ao conectar com API:', error));