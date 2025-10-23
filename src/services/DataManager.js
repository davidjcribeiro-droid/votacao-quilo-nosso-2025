// DataManager centralizado - única fonte de verdade para todos os dados
class DataManager {
  constructor() {
    this.listeners = []
    this.data = {
      pratos: [],
      jurados: [],
      avaliacoes: []
    }
    this.loadData()
  }

  // Carregar dados do localStorage
  loadData() {
    try {
      this.data.pratos = JSON.parse(localStorage.getItem('pratos') || '[]')
      this.data.jurados = JSON.parse(localStorage.getItem('jurados') || '[]')
      
      // Carregar avaliações de todas as fontes
      const avaliacoesGerais = JSON.parse(localStorage.getItem('avaliacoes') || '[]')
      const avaliacoesVotacao = this.loadAvaliacoesVotacao()
      
      // Combinar e deduplificar avaliações
      this.data.avaliacoes = this.combinarAvaliacoes(avaliacoesGerais, avaliacoesVotacao)
      
      this.notifyListeners()
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  // Carregar avaliações do sistema de votação
  loadAvaliacoesVotacao() {
    const avaliacoes = []
    this.data.jurados.forEach(jurado => {
      const chaveVotacoes = `votacoes_jurado_${jurado.id}`
      const votacoesSalvas = localStorage.getItem(chaveVotacoes)
      
      if (votacoesSalvas) {
        const votacoes = JSON.parse(votacoesSalvas)
        Object.keys(votacoes).forEach(pratoId => {
          const votacao = votacoes[pratoId]
          if (votacao && votacao.completa) {
            avaliacoes.push({
              id: `${jurado.id}_${pratoId}`,
              jurado_id: jurado.id,
              prato_id: parseInt(pratoId),
              jurado_nome: jurado.nome,
              originalidade: votacao.originalidade || 0,
              receita: votacao.receita || 0,
              apresentacao: votacao.apresentacao || 0,
              harmonia: votacao.harmonia || 0,
              sabor: votacao.sabor || 0,
              adequacao: votacao.adequacao || 0,
              completa: true,
              created_at: votacao.dataCompleta || new Date().toISOString()
            })
          }
        })
      }
    })
    return avaliacoes
  }

  // Combinar avaliações de diferentes fontes
  combinarAvaliacoes(gerais, votacao) {
    const combinadas = [...gerais]
    
    votacao.forEach(avVotacao => {
      const existe = combinadas.find(av => 
        av.jurado_id === avVotacao.jurado_id && av.prato_id === avVotacao.prato_id
      )
      
      if (!existe) {
        combinadas.push(avVotacao)
      }
    })
    
    return combinadas
  }

  // Adicionar listener para mudanças
  addListener(callback) {
    this.listeners.push(callback)
  }

  // Remover listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback)
  }

  // Notificar todos os listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.data))
  }

  // MÉTODOS PARA PRATOS
  getPratos() {
    return this.data.pratos
  }

  addPrato(prato) {
    const novoId = Math.max(0, ...this.data.pratos.map(p => p.id)) + 1
    const novoPrato = { ...prato, id: novoId, created_at: new Date().toISOString() }
    
    this.data.pratos.push(novoPrato)
    localStorage.setItem('pratos', JSON.stringify(this.data.pratos))
    this.notifyListeners()
    
    return novoPrato
  }

  updatePrato(id, updates) {
    const index = this.data.pratos.findIndex(p => p.id === id)
    if (index >= 0) {
      this.data.pratos[index] = { ...this.data.pratos[index], ...updates }
      localStorage.setItem('pratos', JSON.stringify(this.data.pratos))
      this.notifyListeners()
      return this.data.pratos[index]
    }
    return null
  }

  deletePrato(id) {
    this.data.pratos = this.data.pratos.filter(p => p.id !== id)
    localStorage.setItem('pratos', JSON.stringify(this.data.pratos))
    this.notifyListeners()
    return true
  }

  // MÉTODOS PARA JURADOS
  getJurados() {
    return this.data.jurados
  }

  addJurado(jurado) {
    const novoId = Math.max(0, ...this.data.jurados.map(j => j.id)) + 1
    const novoJurado = { 
      ...jurado, 
      id: novoId, 
      ativo: true,
      created_at: new Date().toISOString() 
    }
    
    this.data.jurados.push(novoJurado)
    localStorage.setItem('jurados', JSON.stringify(this.data.jurados))
    this.notifyListeners()
    
    return novoJurado
  }

  updateJurado(id, updates) {
    const index = this.data.jurados.findIndex(j => j.id === id)
    if (index >= 0) {
      this.data.jurados[index] = { ...this.data.jurados[index], ...updates }
      localStorage.setItem('jurados', JSON.stringify(this.data.jurados))
      this.notifyListeners()
      return this.data.jurados[index]
    }
    return null
  }

  deleteJurado(id) {
    this.data.jurados = this.data.jurados.filter(j => j.id !== id)
    localStorage.setItem('jurados', JSON.stringify(this.data.jurados))
    
    // Limpar votações do jurado
    localStorage.removeItem(`votacoes_jurado_${id}`)
    
    // Remover avaliações do jurado
    this.data.avaliacoes = this.data.avaliacoes.filter(a => a.jurado_id !== id)
    localStorage.setItem('avaliacoes', JSON.stringify(this.data.avaliacoes))
    
    this.notifyListeners()
    return true
  }

  // MÉTODOS PARA AVALIAÇÕES
  getAvaliacoes() {
    return this.data.avaliacoes
  }

  addAvaliacao(avaliacao) {
    // Verificar se já existe
    const existe = this.data.avaliacoes.find(a => 
      a.jurado_id === avaliacao.jurado_id && a.prato_id === avaliacao.prato_id
    )

    if (existe) {
      // Atualizar existente
      Object.assign(existe, avaliacao)
    } else {
      // Adicionar nova
      this.data.avaliacoes.push({
        ...avaliacao,
        id: `${avaliacao.jurado_id}_${avaliacao.prato_id}`,
        created_at: new Date().toISOString()
      })
    }

    // Salvar em ambos os formatos para compatibilidade
    localStorage.setItem('avaliacoes', JSON.stringify(this.data.avaliacoes))
    this.salvarAvaliacaoVotacao(avaliacao)
    
    this.notifyListeners()
    return avaliacao
  }

  // Salvar no formato do sistema de votação
  salvarAvaliacaoVotacao(avaliacao) {
    const chaveVotacoes = `votacoes_jurado_${avaliacao.jurado_id}`
    const votacoesSalvas = localStorage.getItem(chaveVotacoes) || '{}'
    const votacoes = JSON.parse(votacoesSalvas)

    votacoes[avaliacao.prato_id] = {
      originalidade: avaliacao.originalidade,
      receita: avaliacao.receita,
      apresentacao: avaliacao.apresentacao,
      harmonia: avaliacao.harmonia,
      sabor: avaliacao.sabor,
      adequacao: avaliacao.adequacao,
      completa: true,
      dataCompleta: new Date().toISOString(),
      prato: this.data.pratos.find(p => p.id === avaliacao.prato_id),
      jurado: this.data.jurados.find(j => j.id === avaliacao.jurado_id)
    }

    localStorage.setItem(chaveVotacoes, JSON.stringify(votacoes))
  }

  // ESTATÍSTICAS
  getEstatisticas() {
    return {
      total_pratos: this.data.pratos.length,
      jurados_ativos: this.data.jurados.filter(j => j.ativo !== false).length,
      total_avaliacoes: this.data.avaliacoes.length,
      avaliacoes_completas: this.data.avaliacoes.filter(a => a.completa).length,
      progresso: this.data.pratos.length > 0 && this.data.jurados.length > 0 
        ? (this.data.avaliacoes.length / (this.data.pratos.length * this.data.jurados.length)) * 100 
        : 0
    }
  }

  // Forçar recarregamento dos dados
  refresh() {
    this.loadData()
  }
}

// Instância singleton
const dataManager = new DataManager()

export default dataManager
