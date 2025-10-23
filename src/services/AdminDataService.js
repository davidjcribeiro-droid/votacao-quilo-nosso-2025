import { supabase } from './supabase.js'

class AdminDataService {
  // PRATOS
  async getPratos() {
    try {
      const { data, error } = await supabase
        .from('pratos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erro ao buscar pratos:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erro ao carregar pratos:', error)
      return []
    }
  }

  async getPrato(id) {
    try {
      const { data, error } = await supabase
        .from('pratos')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Erro ao buscar prato:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao carregar prato:', error)
      return null
    }
  }

  async addPrato(pratoData) {
    try {
      const { data, error } = await supabase
        .from('pratos')
        .insert([{
          nome: pratoData.nome,
          restaurante: pratoData.restaurante,
          descricao: pratoData.descricao,
          chef: pratoData.chef,
          estado: pratoData.estado,
          categoria: pratoData.categoria || 'Prato Principal',
          tempo: pratoData.tempo || '60 min',
          porcoes: pratoData.porcoes || '4-6 pessoas',
          imagem: pratoData.imagem || '/images/pratos/default.jpg'
        }])
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao adicionar prato:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao adicionar prato:', error)
      return null
    }
  }

  async updatePrato(id, pratoData) {
    try {
      const { data, error } = await supabase
        .from('pratos')
        .update(pratoData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao atualizar prato:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao atualizar prato:', error)
      return null
    }
  }

  async deletePrato(id) {
    try {
      const { error } = await supabase
        .from('pratos')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Erro ao deletar prato:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Erro ao deletar prato:', error)
      return false
    }
  }

  // JURADOS
  async getJurados() {
    try {
      const { data, error } = await supabase
        .from('jurados')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erro ao buscar jurados:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erro ao carregar jurados:', error)
      return []
    }
  }

  async getJurado(id) {
    try {
      const { data, error } = await supabase
        .from('jurados')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Erro ao buscar jurado:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao carregar jurado:', error)
      return null
    }
  }

  async addJurado(juradoData) {
    try {
      const { data, error } = await supabase
        .from('jurados')
        .insert([{
          nome: juradoData.nome,
          email: juradoData.email,
          especialidade: juradoData.especialidade,
          ativo: true
        }])
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao adicionar jurado:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao adicionar jurado:', error)
      return null
    }
  }

  async updateJurado(id, juradoData) {
    try {
      const { data, error } = await supabase
        .from('jurados')
        .update(juradoData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao atualizar jurado:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao atualizar jurado:', error)
      return null
    }
  }

  async deleteJurado(id) {
    try {
      // Marcar como inativo em vez de deletar
      const { error } = await supabase
        .from('jurados')
        .update({ ativo: false })
        .eq('id', id)
      
      if (error) {
        console.error('Erro ao desativar jurado:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Erro ao desativar jurado:', error)
      return false
    }
  }

  // AVALIAÇÕES
  async getAvaliacoes() {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          pratos(nome, restaurante),
          jurados(nome)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erro ao buscar avaliações:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error)
      return []
    }
  }

  async addAvaliacao(avaliacaoData) {
    try {
      // Verificar se já existe avaliação deste jurado para este prato
      const { data: existing } = await supabase
        .from('avaliacoes')
        .select('id')
        .eq('jurado_id', avaliacaoData.jurado_id)
        .eq('prato_id', avaliacaoData.prato_id)
        .single()

      if (existing) {
        // Atualizar existente
        const { data, error } = await supabase
          .from('avaliacoes')
          .update({
            originalidade: avaliacaoData.originalidade,
            receita: avaliacaoData.receita,
            apresentacao: avaliacaoData.apresentacao,
            harmonia: avaliacaoData.harmonia,
            sabor: avaliacaoData.sabor,
            adequacao: avaliacaoData.adequacao,
            completa: true
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar avaliação:', error)
          return null
        }

        return data
      } else {
        // Criar nova
        const { data, error } = await supabase
          .from('avaliacoes')
          .insert([{
            jurado_id: avaliacaoData.jurado_id,
            prato_id: avaliacaoData.prato_id,
            jurado_nome: avaliacaoData.jurado_nome,
            originalidade: avaliacaoData.originalidade,
            receita: avaliacaoData.receita,
            apresentacao: avaliacaoData.apresentacao,
            harmonia: avaliacaoData.harmonia,
            sabor: avaliacaoData.sabor,
            adequacao: avaliacaoData.adequacao,
            completa: true
          }])
          .select()
          .single()

        if (error) {
          console.error('Erro ao adicionar avaliação:', error)
          return null
        }

        return data
      }
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error)
      return null
    }
  }

  // ESTATÍSTICAS
  async getEstatisticas() {
    try {
      const [pratosResult, juradosResult, avaliacoesResult] = await Promise.all([
        supabase.from('pratos').select('id'),
        supabase.from('jurados').select('id').eq('ativo', true),
        supabase.from('avaliacoes').select('id').eq('completa', true)
      ])
      
      return {
        totalPratos: pratosResult.data?.length || 0,
        totalJurados: juradosResult.data?.length || 0,
        totalAvaliacoes: avaliacoesResult.data?.length || 0,
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
  async getRankings() {
    try {
      const [pratos, jurados, avaliacoes] = await Promise.all([
        this.getPratos(),
        this.getJurados(),
        this.getAvaliacoes()
      ])

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
            jurado: jurado ? jurado.nome : avaliacao.jurado_nome || 'Desconhecido',
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

  // RECEITAS
  async getReceitas() {
    try {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erro ao buscar receitas:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
      return []
    }
  }

  async addReceita(receitaData) {
    try {
      const { data, error } = await supabase
        .from('receitas')
        .insert([receitaData])
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao adicionar receita:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao adicionar receita:', error)
      return null
    }
  }

  async updateReceita(id, receitaData) {
    try {
      const { data, error } = await supabase
        .from('receitas')
        .update(receitaData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao atualizar receita:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao atualizar receita:', error)
      return null
    }
  }

  async deleteReceita(id) {
    try {
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Erro ao deletar receita:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Erro ao deletar receita:', error)
      return false
    }
  }
}

export default new AdminDataService()
