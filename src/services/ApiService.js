// Serviço de comunicação com a API backend
class ApiService {
  constructor() {
    // URL base da API - usar localhost para desenvolvimento
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://oquiloenosso-backend.vercel.app/api'  // URL de produção
      : 'http://localhost:3001/api';  // URL de desenvolvimento
  }

  // Método auxiliar para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }

  // ========== PRATOS ==========
  
  async getPratos() {
    return await this.request('/pratos');
  }

  async getPrato(id) {
    return await this.request(`/pratos/${id}`);
  }

  async createPrato(pratoData) {
    return await this.request('/pratos', {
      method: 'POST',
      body: JSON.stringify(pratoData)
    });
  }

  async updatePrato(id, pratoData) {
    return await this.request(`/pratos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pratoData)
    });
  }

  async deletePrato(id) {
    return await this.request(`/pratos/${id}`, {
      method: 'DELETE'
    });
  }

  // ========== JURADOS ==========
  
  async getJurados() {
    return await this.request('/jurados');
  }

  async getJurado(id) {
    return await this.request(`/jurados/${id}`);
  }

  async createJurado(juradoData) {
    return await this.request('/jurados', {
      method: 'POST',
      body: JSON.stringify(juradoData)
    });
  }

  async updateJurado(id, juradoData) {
    return await this.request(`/jurados/${id}`, {
      method: 'PUT',
      body: JSON.stringify(juradoData)
    });
  }

  async deleteJurado(id) {
    return await this.request(`/jurados/${id}`, {
      method: 'DELETE'
    });
  }

  // ========== AVALIAÇÕES ==========
  
  async getAvaliacoes() {
    return await this.request('/avaliacoes');
  }

  async getAvaliacoesByJurado(juradoId) {
    return await this.request(`/avaliacoes/jurado/${juradoId}`);
  }

  async getAvaliacoesByPrato(pratoId) {
    return await this.request(`/avaliacoes/prato/${pratoId}`);
  }

  async createAvaliacao(avaliacaoData) {
    return await this.request('/avaliacoes', {
      method: 'POST',
      body: JSON.stringify(avaliacaoData)
    });
  }

  async updateAvaliacao(id, avaliacaoData) {
    return await this.request(`/avaliacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(avaliacaoData)
    });
  }

  async deleteAvaliacao(id) {
    return await this.request(`/avaliacoes/${id}`, {
      method: 'DELETE'
    });
  }

  // ========== RANKING ==========
  
  async getRanking() {
    return await this.request('/ranking');
  }

  async getRankingByJurado(juradoId) {
    return await this.request(`/ranking/jurado/${juradoId}`);
  }

  // ========== ESTATÍSTICAS ==========
  
  async getEstatisticas() {
    return await this.request('/estatisticas');
  }

  // ========== MÉTODOS DE SINCRONIZAÇÃO ==========
  
  // Verificar se a API está disponível
  async isApiAvailable() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/api/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Sincronizar dados do localStorage com a API (para migração)
  async syncLocalStorageToApi() {
    try {
      // Verificar se a API está disponível
      const apiAvailable = await this.isApiAvailable();
      if (!apiAvailable) {
        console.warn('API não disponível para sincronização');
        return false;
      }

      // Sincronizar pratos
      const localPratos = JSON.parse(localStorage.getItem('admin_pratos') || '[]');
      for (const prato of localPratos) {
        try {
          await this.createPrato(prato);
        } catch (error) {
          console.warn(`Erro ao sincronizar prato ${prato.id}:`, error);
        }
      }

      // Sincronizar jurados
      const localJurados = JSON.parse(localStorage.getItem('admin_jurados') || '[]');
      for (const jurado of localJurados) {
        try {
          await this.createJurado(jurado);
        } catch (error) {
          console.warn(`Erro ao sincronizar jurado ${jurado.id}:`, error);
        }
      }

      console.log('Sincronização com API concluída');
      return true;
    } catch (error) {
      console.error('Erro na sincronização:', error);
      return false;
    }
  }
}

// Exportar instância única
const apiService = new ApiService();
export default apiService;
