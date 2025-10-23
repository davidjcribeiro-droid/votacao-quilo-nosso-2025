import dataManager from './DataManager.js'

class AdminDataService {
  // PRATOS
  getPratos() {
    return dataManager.getPratos()
  }

  getPrato(id) {
    return dataManager.getPratos().find(p => p.id === parseInt(id))
  }

  addPrato(pratoData) {
    return dataManager.addPrato(pratoData)
  }

  updatePrato(id, pratoData) {
    return dataManager.updatePrato(parseInt(id), pratoData)
  }

  deletePrato(id) {
    return dataManager.deletePrato(parseInt(id))
  }

  // JURADOS
  getJurados() {
    return dataManager.getJurados()
  }

  getJurado(id) {
    return dataManager.getJurados().find(j => j.id === parseInt(id))
  }

  addJurado(juradoData) {
    return dataManager.addJurado(juradoData)
  }

  updateJurado(id, juradoData) {
    return dataManager.updateJurado(parseInt(id), juradoData)
  }

  deleteJurado(id) {
    return dataManager.deleteJurado(parseInt(id))
  }

  // AVALIAÇÕES
  getAvaliacoes() {
    return dataManager.getAvaliacoes()
  }

  addAvaliacao(avaliacaoData) {
    return dataManager.addAvaliacao(avaliacaoData)
  }

  // ESTATÍSTICAS
  getEstatisticas() {
    return dataManager.getEstatisticas()
  }

  // RANKINGS
  getRankings() {
    const pratos = this.getPratos()
    const jurados = this.getJurados()
    const avaliacoes = this.getAvaliacoes()

    const criterios = [
      { id: 'originalidade', peso: 2 },
      { id: 'receita', peso: 3 },
      { id: 'apresentacao', peso: 2 },
      { id: 'harmonia', peso: 2 },
      { id: 'sabor', peso: 3 },
      { id: 'adequacao', peso: 1 }
    ]

    const pesoTotal = criterios.reduce((sum, c) => sum + c.peso, 0)

    // Ranking geral
    const rankingGeral = pratos.map(prato => {
      const avaliacoesPrato = avaliacoes.filter(a => a.prato_id === prato.id)
      
      if (avaliacoesPrato.length === 0) {
        return {
          ...prato,
          pontuacao: 0,
          percentual: 0,
          totalVotacoes: 0,
          detalhesJurados: []
        }
      }

      let totalPontos = 0
      const detalhesJurados = []

      avaliacoesPrato.forEach(avaliacao => {
        let pontosAvaliacao = 0
        criterios.forEach(criterio => {
          pontosAvaliacao += (avaliacao[criterio.id] * criterio.peso)
        })
        
        totalPontos += pontosAvaliacao
        
        const jurado = jurados.find(j => j.id === avaliacao.jurado_id)
        detalhesJurados.push({
          jurado: jurado ? jurado.nome : 'Desconhecido',
          pontos: pontosAvaliacao,
          percentual: (pontosAvaliacao / (pesoTotal * 5)) * 100
        })
      })

      const mediaFinal = avaliacoesPrato.length > 0 ? totalPontos / avaliacoesPrato.length : 0
      const percentualFinal = (mediaFinal / (pesoTotal * 5)) * 100

      return {
        ...prato,
        pontuacao: mediaFinal,
        percentual: percentualFinal,
        totalVotacoes: avaliacoesPrato.length,
        detalhesJurados
      }
    }).sort((a, b) => b.pontuacao - a.pontuacao)

    return {
      geral: rankingGeral,
      porJurado: {}
    }
  }
}

export default new AdminDataService()
