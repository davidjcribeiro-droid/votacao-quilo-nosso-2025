import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  BarChart3,
  RefreshCw,
  Eye,
  Crown,
  Download,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react'
import hybridDataService from '../../services/HybridDataService.js'

const RankingManager = () => {
  const [rankings, setRankings] = useState({
    geral: [],
    porJurado: {}
  })
  const [pratos, setPratos] = useState([])
  const [jurados, setJurados] = useState([])
  const [avaliacoes, setAvaliacoes] = useState([])
  const [estatisticas, setEstatisticas] = useState({})
  const [selectedJurado, setSelectedJurado] = useState('geral')
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [usingApi, setUsingApi] = useState(false)

  useEffect(() => {
    loadData()
    // Atualizar ranking a cada 30 segundos
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Verificar se está usando API
      setUsingApi(hybridDataService.isUsingApi())

      // Carregar dados usando o serviço híbrido
      const [pratosData, juradosData, avaliacoesData, estatisticasData] = await Promise.all([
        hybridDataService.getPratos(),
        hybridDataService.getJurados(),
        hybridDataService.getAvaliacoes(),
        hybridDataService.getEstatisticas()
      ])
      
      setPratos(pratosData)
      setJurados(juradosData)
      setAvaliacoes(avaliacoesData)
      setEstatisticas(estatisticasData)
      
      // Calcular rankings
      const rankingData = calcularRankings(pratosData, juradosData, avaliacoesData)
      setRankings(rankingData)
      setLastUpdate(new Date())
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      // Em caso de erro, tentar carregar dados básicos do localStorage
      try {
        const pratosLocal = JSON.parse(localStorage.getItem('pratos') || '[]')
        const juradosLocal = JSON.parse(localStorage.getItem('jurados') || '[]')
        const avaliacoesLocal = JSON.parse(localStorage.getItem('avaliacoes') || '{}')
        
        setPratos(pratosLocal)
        setJurados(juradosLocal)
        
        // Converter avaliações do localStorage para formato esperado
        const avaliacoesArray = []
        Object.keys(avaliacoesLocal).forEach(juradoId => {
          const jurado = juradosLocal.find(j => j.id.toString() === juradoId)
          Object.keys(avaliacoesLocal[juradoId]).forEach(pratoId => {
            const avaliacaoPrato = avaliacoesLocal[juradoId][pratoId]
            if (avaliacaoPrato && Object.keys(avaliacaoPrato).length > 0) {
              avaliacoesArray.push({
                jurado_id: parseInt(juradoId),
                prato_id: parseInt(pratoId),
                jurado_nome: jurado ? jurado.nome : 'Desconhecido',
                ...avaliacaoPrato
              })
            }
          })
        })
        
        console.log('📦 Dados do localStorage carregados:', {
          pratos: pratosLocal.length,
          jurados: juradosLocal.length,
          avaliacoes: avaliacoesArray.length
        })
        
        setAvaliacoes(avaliacoesArray)
        
        // Calcular estatísticas básicas
        const estatisticasLocal = {
          total_pratos: pratosLocal.length,
          jurados_ativos: juradosLocal.filter(j => j.ativo !== false).length,
          total_avaliacoes: avaliacoesArray.length,
          avaliacoes_completas: avaliacoesArray.filter(a => 
            a.originalidade && a.receita && a.apresentacao && 
            a.harmonia && a.sabor && a.adequacao
          ).length
        }
        setEstatisticas(estatisticasLocal)
        
        // Calcular rankings com dados locais
        const rankingData = calcularRankings(pratosLocal, juradosLocal, avaliacoesArray)
        setRankings(rankingData)
        setLastUpdate(new Date())
        
      } catch (localError) {
        console.error('Erro ao carregar dados locais:', localError)
      }
    } finally {
      setLoading(false)
    }
  }

  const calcularRankings = (pratosData, juradosData, avaliacoesData) => {
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
    const rankingGeral = pratosData.map(prato => {
      const avaliacoesPrato = avaliacoesData.filter(a => a.prato_id === prato.id)
      
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
        
        const jurado = juradosData.find(j => j.id === avaliacao.jurado_id)
        detalhesJurados.push({
          jurado: jurado ? jurado.nome : 'Desconhecido',
          pontos: pontosAvaliacao,
          percentual: (pontosAvaliacao / (pesoTotal * 10)) * 100
        })
      })

      const mediaFinal = avaliacoesPrato.length > 0 ? totalPontos / avaliacoesPrato.length : 0
      const percentualFinal = (mediaFinal / (pesoTotal * 10)) * 100

      return {
        ...prato,
        pontuacao: mediaFinal,
        percentual: percentualFinal,
        totalVotacoes: avaliacoesPrato.length,
        detalhesJurados
      }
    }).sort((a, b) => b.pontuacao - a.pontuacao)

    // Rankings por jurado
    const rankingsPorJurado = {}
    juradosData.forEach(jurado => {
      const avaliacoesJurado = avaliacoesData.filter(a => a.jurado_id === jurado.id)
      
      const rankingJurado = pratosData.map(prato => {
        const avaliacaoPrato = avaliacoesJurado.find(a => a.prato_id === prato.id)
        let pontuacao = 0
        let avaliado = false
        
        if (avaliacaoPrato) {
          criterios.forEach(criterio => {
            pontuacao += (avaliacaoPrato[criterio.id] * criterio.peso)
          })
          avaliado = true
        }
        
        return {
          ...prato,
          pontuacao,
          percentual: (pontuacao / (pesoTotal * 10)) * 100,
          avaliado
        }
      }).sort((a, b) => b.pontuacao - a.pontuacao)
      
      rankingsPorJurado[jurado.id] = {
        jurado: jurado.nome,
        ranking: rankingJurado,
        totalAvaliados: rankingJurado.filter(p => p.avaliado).length
      }
    })

    return {
      geral: rankingGeral,
      porJurado: rankingsPorJurado
    }
  }

  const exportarCSV = () => {
    const rankingAtual = selectedJurado === 'geral' 
      ? rankings.geral 
      : rankings.porJurado[selectedJurado]?.ranking || []

    const headers = ['Posição', 'Prato', 'Restaurante', 'Pontuação', 'Percentual', 'Avaliações']
    const rows = rankingAtual.map((prato, index) => [
      index + 1,
      prato.nome,
      prato.restaurante,
      prato.pontuacao.toFixed(2),
      prato.percentual.toFixed(1) + '%',
      prato.totalVotacoes || (prato.avaliado ? 1 : 0)
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `ranking_${selectedJurado}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getRankingIcon = (posicao) => {
    switch (posicao) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Award className="h-5 w-5 text-amber-600" />
      default: return <div className="h-5 w-5 flex items-center justify-center text-sm font-bold text-gray-500">{posicao}</div>
    }
  }

  const getRankingColor = (posicao) => {
    switch (posicao) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600'
    }
  }

  const rankingAtual = selectedJurado === 'geral' 
    ? rankings.geral 
    : rankings.porJurado[selectedJurado]?.ranking || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Ranking em Tempo Real</h2>
          <div className="flex items-center gap-2">
            {usingApi ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Database className="h-3 w-3 mr-1" />
                Supabase
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Wifi className="h-3 w-3 mr-1" />
                Local
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <div className="text-sm text-gray-600">
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            </div>
          )}
          <Button
            onClick={exportarCSV}
            variant="outline"
            size="sm"
            disabled={rankingAtual.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            onClick={loadData}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Seletor de visualização */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Visualizar ranking:</label>
        <Select value={selectedJurado} onValueChange={setSelectedJurado}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="geral">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Ranking Geral
              </div>
            </SelectItem>
            {jurados.map(jurado => (
              <SelectItem key={jurado.id} value={jurado.id.toString()}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {jurado.nome}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas gerais */}
      {selectedJurado === 'geral' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Pratos</p>
                  <p className="text-xl font-bold">{estatisticas.total_pratos || pratos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jurados Ativos</p>
                  <p className="text-xl font-bold">{estatisticas.total_jurados || jurados.filter(j => j.ativo).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avaliações Completas</p>
                  <p className="text-xl font-bold">
                    {estatisticas.total_avaliacoes || avaliacoes.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progresso Geral</p>
                  <p className="text-xl font-bold">
                    {estatisticas.progresso_geral || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {selectedJurado === 'geral' 
              ? 'Ranking Geral' 
              : `Ranking - ${rankings.porJurado[selectedJurado]?.jurado}`
            }
            {selectedJurado !== 'geral' && rankings.porJurado[selectedJurado] && (
              <Badge variant="secondary">
                {rankings.porJurado[selectedJurado].totalAvaliados} de {pratos.length} avaliados
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankingAtual.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma avaliação encontrada</p>
                <p className="text-sm text-gray-400 mt-2">
                  As avaliações aparecerão aqui conforme forem sendo realizadas
                </p>
              </div>
            ) : (
              rankingAtual.map((prato, index) => {
                const posicao = index + 1
                const isAvaliado = selectedJurado === 'geral' ? prato.totalVotacoes > 0 : prato.avaliado

                return (
                  <div
                    key={prato.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      isAvaliado 
                        ? 'border-gray-200 bg-white shadow-sm hover:shadow-md' 
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full text-white ${getRankingColor(posicao)}`}>
                          {getRankingIcon(posicao)}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">{prato.nome}</h3>
                          <p className="text-gray-600">{prato.restaurante}</p>
                          {prato.chef && (
                            <p className="text-sm text-gray-500">Chef: {prato.chef}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        {isAvaliado ? (
                          <>
                            <div className="text-2xl font-bold text-gray-800">
                              {prato.pontuacao.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {prato.percentual.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {selectedJurado === 'geral' 
                                ? `${prato.totalVotacoes} avaliação${prato.totalVotacoes !== 1 ? 'ões' : ''}` 
                                : 'Avaliado'
                              }
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400">
                            <div className="text-lg">-</div>
                            <div className="text-xs">Não avaliado</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detalhes das avaliações para ranking geral */}
                    {selectedJurado === 'geral' && prato.detalhesJurados && prato.detalhesJurados.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {prato.detalhesJurados.map((detalhe, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{detalhe.jurado}:</span>
                              <span className="font-medium">
                                {detalhe.pontos.toFixed(1)} ({detalhe.percentual.toFixed(1)}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RankingManager
