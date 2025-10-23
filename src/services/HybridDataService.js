// Serviço híbrido que usa API quando disponível e localStorage como fallback
import apiService from './ApiService.js';
import adminDataService from './AdminDataService.js';

class HybridDataService {
  constructor() {
    this.useApi = false;
    this.checkApiAvailability();
  }

  // Verificar disponibilidade da API
  async checkApiAvailability() {
    try {
      this.useApi = await apiService.isApiAvailable();
      console.log(`Usando ${this.useApi ? 'API' : 'localStorage'} para dados`);
      
      // Se API está disponível, tentar sincronizar dados do localStorage
      if (this.useApi) {
        await this.syncDataIfNeeded();
      }
    } catch (error) {
      console.warn('Erro ao verificar API, usando localStorage:', error);
      this.useApi = false;
    }
  }

  // Sincronizar dados do localStorage para API se necessário
  async syncDataIfNeeded() {
    try {
      const lastSync = localStorage.getItem('last_api_sync');
      const now = new Date().toISOString();
      
      // Sincronizar se nunca foi feito ou se foi há mais de 1 hora
      if (!lastSync || (new Date(now) - new Date(lastSync)) > 3600000) {
        console.log('Iniciando sincronização de dados...');
        await apiService.syncLocalStorageToApi();
        localStorage.setItem('last_api_sync', now);
      }
    } catch (error) {
      console.warn('Erro na sincronização:', error);
    }
  }

  // ========== PRATOS ==========
  
  async getPratos() {
    if (this.useApi) {
      try {
        const result = await apiService.getPratos();
        // Verificar se a resposta tem o formato esperado da API Supabase
        if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn('Formato inesperado da API, usando localStorage:', result);
          return adminDataService.getPratos();
        }
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.getPratos();
      }
    }
    return adminDataService.getPratos();
  }

  async getPrato(id) {
    if (this.useApi) {
      try {
        return await apiService.getPrato(id);
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.getPrato(id);
      }
    }
    return adminDataService.getPrato(id);
  }

  async addPrato(pratoData) {
    if (this.useApi) {
      try {
        const result = await apiService.createPrato(pratoData);
        // Também salvar no localStorage para sincronização
        adminDataService.addPrato(pratoData);
        return result;
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.addPrato(pratoData);
      }
    }
    return adminDataService.addPrato(pratoData);
  }

  async updatePrato(id, pratoData) {
    if (this.useApi) {
      try {
        const result = await apiService.updatePrato(id, pratoData);
        // Também atualizar no localStorage
        adminDataService.updatePrato(id, pratoData);
        return result;
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.updatePrato(id, pratoData);
      }
    }
    return adminDataService.updatePrato(id, pratoData);
  }

  async deletePrato(id) {
    if (this.useApi) {
      try {
        const result = await apiService.deletePrato(id);
        // Também deletar do localStorage
        adminDataService.deletePrato(id);
        return result;
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.deletePrato(id);
      }
    }
    return adminDataService.deletePrato(id);
  }

  // ========== JURADOS ==========
  
  async getJurados() {
    if (this.useApi) {
      try {
        const result = await apiService.getJurados();
        // Verificar se a resposta tem o formato esperado da API Supabase
        if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn('Formato inesperado da API, usando localStorage:', result);
          return adminDataService.getJurados();
        }
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.getJurados();
      }
    }
    return adminDataService.getJurados();
  }

  async getJurado(id) {
    if (this.useApi) {
      try {
        return await apiService.getJurado(id);
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.getJurado(id);
      }
    }
    return adminDataService.getJurado(id);
  }

  async addJurado(juradoData) {
    if (this.useApi) {
      try {
        const result = await apiService.createJurado(juradoData);
        // Também salvar no localStorage
        adminDataService.addJurado(juradoData);
        return result;
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.addJurado(juradoData);
      }
    }
    return adminDataService.addJurado(juradoData);
  }

  async updateJurado(id, juradoData) {
    if (this.useApi) {
      try {
        const result = await apiService.updateJurado(id, juradoData);
        // Também atualizar no localStorage
        adminDataService.updateJurado(id, juradoData);
        return result;
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.updateJurado(id, juradoData);
      }
    }
    return adminDataService.updateJurado(id, juradoData);
  }

  async deleteJurado(id) {
    if (this.useApi) {
      try {
        const result = await apiService.deleteJurado(id);
        // Também deletar do localStorage
        adminDataService.deleteJurado(id);
        return result;
      } catch (error) {
        console.warn('Erro na API, usando localStorage:', error);
        return adminDataService.deleteJurado(id);
      }
    }
    return adminDataService.deleteJurado(id);
  }

  // ========== AVALIAÇÕES ==========
  
  async getAvaliacoes() {
    if (this.useApi) {
      try {
        const result = await apiService.getAvaliacoes();
        // Verificar se a resposta tem o formato esperado da API Supabase
        if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        } else if (Array.isArray(result)) {
          return result;
        } else {
          console.warn('Erro na API para avaliações, usando localStorage:', result);
          return this.getAvaliacoesFromLocalStorage();
        }
      } catch (error) {
        console.warn('Erro na API para avaliações, usando localStorage:', error);
        return this.getAvaliacoesFromLocalStorage();
      }
    }
    return this.getAvaliacoesFromLocalStorage();
  }

  // Método para buscar avaliações do localStorage (formato atual)
  getAvaliacoesFromLocalStorage() {
    const jurados = adminDataService.getJurados();
    const pratos = adminDataService.getPratos();
    const avaliacoes = [];

    jurados.forEach(jurado => {
      const chaveVotacoes = `votacoes_jurado_${jurado.id}`;
      const votacoesSalvas = localStorage.getItem(chaveVotacoes);
      
      if (votacoesSalvas) {
        const votacoes = JSON.parse(votacoesSalvas);
        
        Object.keys(votacoes).forEach(pratoId => {
          const votacao = votacoes[pratoId];
          if (votacao && votacao.completa) {
            avaliacoes.push({
              id: `${jurado.id}_${pratoId}`,
              jurado_id: jurado.id,
              prato_id: parseInt(pratoId),
              originalidade: votacao.originalidade || 0,
              receita: votacao.receita || 0,
              apresentacao: votacao.apresentacao || 0,
              harmonia: votacao.harmonia || 0,
              sabor: votacao.sabor || 0,
              adequacao: votacao.adequacao || 0,
              completa: votacao.completa,
              created_at: new Date().toISOString(),
              jurado: jurados.find(j => j.id === jurado.id),
              prato: pratos.find(p => p.id === parseInt(pratoId))
            });
          }
        });
      }
    });

    return avaliacoes;
  }

  async createAvaliacao(avaliacaoData) {
    if (this.useApi) {
      try {
        return await apiService.createAvaliacao(avaliacaoData);
      } catch (error) {
        console.warn('Erro na API para criar avaliação:', error);
        // Fallback: salvar no localStorage no formato atual
        return this.saveAvaliacaoToLocalStorage(avaliacaoData);
      }
    }
    return this.saveAvaliacaoToLocalStorage(avaliacaoData);
  }

  // Salvar avaliação no localStorage (formato atual)
  saveAvaliacaoToLocalStorage(avaliacaoData) {
    const chaveVotacoes = `votacoes_jurado_${avaliacaoData.jurado_id}`;
    const votacoesSalvas = localStorage.getItem(chaveVotacoes);
    const votacoes = votacoesSalvas ? JSON.parse(votacoesSalvas) : {};
    
    votacoes[avaliacaoData.prato_id] = {
      originalidade: avaliacaoData.originalidade,
      receita: avaliacaoData.receita,
      apresentacao: avaliacaoData.apresentacao,
      harmonia: avaliacaoData.harmonia,
      sabor: avaliacaoData.sabor,
      adequacao: avaliacaoData.adequacao,
      completa: avaliacaoData.completa || true
    };
    
    localStorage.setItem(chaveVotacoes, JSON.stringify(votacoes));
    return avaliacaoData;
  }

  // ========== RANKING ==========
  
  async getRanking() {
    if (this.useApi) {
      try {
        return await apiService.getRanking();
      } catch (error) {
        console.warn('Erro na API para ranking, calculando localmente:', error);
        return this.calculateRankingFromLocalStorage();
      }
    }
    return this.calculateRankingFromLocalStorage();
  }

  // Calcular ranking a partir dos dados do localStorage
  calculateRankingFromLocalStorage() {
    const avaliacoes = this.getAvaliacoesFromLocalStorage();
    const pratos = adminDataService.getPratos();
    
    const criterios = [
      { id: 'originalidade', peso: 2 },
      { id: 'receita', peso: 3 },
      { id: 'apresentacao', peso: 2 },
      { id: 'harmonia', peso: 2 },
      { id: 'sabor', peso: 3 },
      { id: 'adequacao', peso: 1 }
    ];

    const pesoTotal = criterios.reduce((sum, c) => sum + c.peso, 0);

    const ranking = pratos.map(prato => {
      const avaliacoesPrato = avaliacoes.filter(a => a.prato_id === prato.id);
      
      if (avaliacoesPrato.length === 0) {
        return {
          ...prato,
          pontuacao_total: 0,
          pontuacao_media: 0,
          percentual: 0,
          total_avaliacoes: 0,
          avaliacoes: []
        };
      }

      let pontuacaoTotal = 0;
      const avaliacoesDetalhadas = [];

      avaliacoesPrato.forEach(avaliacao => {
        let pontuacaoAvaliacao = 0;
        criterios.forEach(criterio => {
          pontuacaoAvaliacao += (avaliacao[criterio.id] * criterio.peso);
        });
        
        pontuacaoTotal += pontuacaoAvaliacao;
        avaliacoesDetalhadas.push({
          ...avaliacao,
          pontuacao: pontuacaoAvaliacao,
          percentual: (pontuacaoAvaliacao / (pesoTotal * 10)) * 100
        });
      });

      const pontuacaoMedia = pontuacaoTotal / avaliacoesPrato.length;
      const percentual = (pontuacaoMedia / (pesoTotal * 10)) * 100;

      return {
        ...prato,
        pontuacao_total: pontuacaoTotal,
        pontuacao_media: pontuacaoMedia,
        percentual: percentual,
        total_avaliacoes: avaliacoesPrato.length,
        avaliacoes: avaliacoesDetalhadas
      };
    }).sort((a, b) => b.pontuacao_media - a.pontuacao_media);

    return ranking;
  }

  // ========== ESTATÍSTICAS ==========
  
  async getEstatisticas() {
    if (this.useApi) {
      try {
        const result = await apiService.getEstatisticas();
        // Verificar se a resposta tem o formato esperado
        if (result && typeof result === 'object' && !Array.isArray(result)) {
          return result;
        } else {
          console.warn('Formato inesperado da API para estatísticas, calculando localmente:', result);
          return this.calculateEstatisticasFromLocalStorage();
        }
      } catch (error) {
        console.warn('Erro na API para estatísticas, calculando localmente:', error);
        return this.calculateEstatisticasFromLocalStorage();
      }
    }
    return this.calculateEstatisticasFromLocalStorage();
  }

  calculateEstatisticasFromLocalStorage() {
    const pratos = adminDataService.getPratos();
    const jurados = adminDataService.getJurados();
    const avaliacoes = this.getAvaliacoesFromLocalStorage();
    
    return {
      total_pratos: pratos.length,
      total_jurados: jurados.filter(j => j.ativo).length,
      total_avaliacoes: avaliacoes.length,
      avaliacoes_completas: avaliacoes.filter(a => a.completa).length,
      progresso_geral: pratos.length > 0 && jurados.length > 0 
        ? Math.round((avaliacoes.length / (pratos.length * jurados.filter(j => j.ativo).length)) * 100)
        : 0
    };
  }

  // ========== MÉTODOS AUXILIARES ==========
  
  // Forçar uso da API
  async forceApiMode() {
    this.useApi = true;
    await this.checkApiAvailability();
  }

  // Forçar uso do localStorage
  forceLocalStorageMode() {
    this.useApi = false;
  }

  // Verificar qual modo está sendo usado
  isUsingApi() {
    return this.useApi;
  }
}

// Exportar instância única
const hybridDataService = new HybridDataService();
export default hybridDataService;
