class AdminDataService {
  // PRATOS
  getPratos() {
    try {
      const pratos = localStorage.getItem('pratos')
      return pratos ? JSON.parse(pratos) : []
    } catch (error) {
      console.error('Erro ao carregar pratos:', error)
      return []
    }
  }

  getPrato(id) {
    const pratos = this.getPratos()
    return pratos.find(p => p.id === parseInt(id))
  }

  addPrato(pratoData) {
    try {
      const pratos = this.getPratos()
      const novoId = Math.max(0, ...pratos.map(p => p.id)) + 1
      const novoPrato = { 
        ...pratoData, 
        id: novoId, 
        created_at: new Date().toISOString() 
      }
      
      pratos.push(novoPrato)
      localStorage.setItem('pratos', JSON.stringify(pratos))
      
      return novoPrato
    } catch (error) {
      console.error('Erro ao adicionar prato:', error)
      return null
    }
  }

  updatePrato(id, pratoData) {
    try {
      const pratos = this.getPratos()
      const index = pratos.findIndex(p => p.id === parseInt(id))
      
      if (index >= 0) {
        pratos[index] = { ...pratos[index], ...pratoData }
        localStorage.setItem('pratos', JSON.stringify(pratos))
        return pratos[index]
      }
      
      return null
    } catch (error) {
      console.error('Erro ao atualizar prato:', error)
      return null
    }
  }

  deletePrato(id) {
    try {
      const pratos = this.getPratos()
      const pratosAtualizados = pratos.filter(p => p.id !== parseInt(id))
      localStorage.setItem('pratos', JSON.stringify(pratosAtualizados))
      return true
    } catch (error) {
      console.error('Erro ao deletar prato:', error)
      return false
    }
  }

  // JURADOS
  getJurados() {
    try {
      const jurados = localStorage.getItem('jurados')
      return jurados ? JSON.parse(jurados) : []
    } catch (error) {
      console.error('Erro ao carregar jurados:', error)
      return []
    }
  }

  getJurado(id) {
    const jurados = this.getJurados()
    return jurados.find(j => j.id === parseInt(id))
  }

  addJurado(juradoData) {
    try {
      const jurados = this.getJurados()
      const novoId = Math.max(0, ...jurados.map(j => j.id)) + 1
      const novoJurado = { 
        ...juradoData, 
        id: novoId, 
        ativo: true,
        created_at: new Date().toISOString() 
      }
      
      jurados.push(novoJurado)
      localStorage.setItem('jurados', JSON.stringify(jurados))
      
      return novoJurado
    } catch (error) {
      console.error('Erro ao adicionar jurado:', error)
      return null
    }
  }

  updateJurado(id, juradoData) {
    try {
      const jurados = this.getJurados()
      const index = jurados.findIndex(j => j.id === parseInt(id))
      
      if (index >= 0) {
        jurados[index] = { ...jurados[index], ...juradoData }
        localStorage.setItem('jurados', JSON.stringify(jurados))
        return jurados[index]
      }
      
      return null
    } catch (error) {
      console.error('Erro ao atualizar jurado:', error)
      return null
    }
  }

  deleteJurado(id) {
    try {
      const jurados = this.getJurados()
      const juradosAtualizados = jurados.filter(j => j.id !== parseInt(id))
      localStorage.setItem('jurados', JSON.stringify(juradosAtualizados))
      
      // Limpar votações do jurado
      localStorage.removeItem(`votacoes_jurado_${id}`)
      
      return true
    } catch (error) {
      console.error('Erro ao deletar jurado:', error)
      return false
    }
  }

  // AVALIAÇÕES
  getAvaliacoes() {
    try {
      const avaliacoes = localStorage.getItem('avaliacoes')
      return avaliacoes ? JSON.parse(avaliacoes) : []
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error)
      return []
    }
  }

  addAvaliacao(avaliacaoData) {
    try {
      const avaliacoes = this.getAvaliacoes()
      
      // Verificar se já existe
      const index = avaliacoes.findIndex(a => 
        a.jurado_id === avaliacaoData.jurado_id && a.prato_id === avaliacaoData.prato_id
      )

      if (index >= 0) {
        // Atualizar existente
        avaliacoes[index] = { ...avaliacoes[index], ...avaliacaoData }
      } else {
        // Adicionar nova
        avaliacoes.push({
          ...avaliacaoData,
          id: `${avaliacaoData.jurado_id}_${avaliacaoData.prato_id}`,
          created_at: new Date().toISOString()
        })
      }

      localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes))
      return avaliacaoData
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error)
      return null
    }
  }

  // ESTATÍSTICAS
  getEstatisticas() {
    try {
      const pratos = this.getPratos()
      const jurados = this.getJurados()
      const avaliacoes = this.getAvaliacoes()
      
      return {
        totalPratos: pratos.length,
        totalJurados: jurados.filter(j => j.ativo !== false).length,
        totalAvaliacoes: avaliacoes.length,
        ultimaAtualizacao: new Date().toISOString()
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error)
      return {
        totalPratos: 0,
        totalJurados: 0,
        totalAvaliacoes: 0,
        ultimaAtualizacao: new Date().toISOString()
      }
    }
  }

  // RANKINGS
  getRankings() {
    try {
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
    } catch (error) {
      console.error('Erro ao calcular rankings:', error)
      return {
        geral: [],
        porJurado: {}
      }
    }
  }
}

export default new AdminDataService()
