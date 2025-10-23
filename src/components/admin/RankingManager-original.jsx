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
  Crown
} from 'lucide-react'
import adminDataService from '../../services/AdminDataService.js'

const RankingManager = () => {
  const [rankings, setRankings] = useState({
    geral: [],
    porJurado: {}
  })
  const [pratos, setPratos] = useState([])
  const [jurados, setJurados] = useState([])
  const [selectedJurado, setSelectedJurado] = useState('geral')
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    loadData()
    // Atualizar ranking a cada 30 segundos
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const pratosData = adminDataService.getPratos()
      const juradosData = adminDataService.getJurados()
      
      setPratos(pratosData)
      setJurados(juradosData)
      
      // Calcular rankings
      const rankingData = calcularRankings(pratosData, juradosData)
      setRankings(rankingData)
      setLastUpdate(new Date())
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcularRankings = (pratosData, juradosData) => {
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
      let totalPontos = 0
      let totalVotacoes = 0
      let detalhesJurados = []

      juradosData.forEach(jurado => {
        const chaveVotacoes = `votacoes_jurado_${jurado.id}`
        const votacoesSalvas = localStorage.getItem(chaveVotacoes)
        
        if (votacoesSalvas) {
          const votacoes = JSON.parse(votacoesSalvas)
          const votacaoPrato = votacoes[prato.id]
          
          if (votacaoPrato && votacaoPrato.completa) {
            let pontosJurado = 0
            criterios.forEach(criterio => {
              if (votacaoPrato[criterio.id]) {
                pontosJurado += (votacaoPrato[criterio.id] * criterio.peso)
              }
            })
            
            totalPontos += pontosJurado
            totalVotacoes++
            
            detalhesJurados.push({
              jurado: jurado.nome,
              pontos: pontosJurado,
              percentual: (pontosJurado / (pesoTotal * 10)) * 100
            })
          }
        }
      })

      const mediaFinal = totalVotacoes > 0 ? totalPontos / totalVotacoes : 0
      const percentualFinal = (mediaFinal / (pesoTotal * 10)) * 100

      return {
        ...prato,
        pontuacao: mediaFinal,
        percentual: percentualFinal,
        totalVotacoes,
        detalhesJurados
      }
    }).sort((a, b) => b.pontuacao - a.pontuacao)

    // Rankings por jurado
    const rankingsPorJurado = {}
    juradosData.forEach(jurado => {
      const chaveVotacoes = `votacoes_jurado_${jurado.id}`
      const votacoesSalvas = localStorage.getItem(chaveVotacoes)
      
      if (votacoesSalvas) {
        const votacoes = JSON.parse(votacoesSalvas)
        
        const rankingJurado = pratosData.map(prato => {
          const votacaoPrato = votacoes[prato.id]
          let pontuacao = 0
          let completa = false
          
          if (votacaoPrato && votacaoPrato.completa) {
            criterios.forEach(criterio => {
              if (votacaoPrato[criterio.id]) {
                pontuacao += (votacaoPrato[criterio.id] * criterio.peso)
              }
            })
            completa = true
          }
          
          return {
            ...prato,
            pontuacao,
            percentual: (pontuacao / (pesoTotal * 10)) * 100,
            avaliado: completa
          }
        }).sort((a, b) => b.pontuacao - a.pontuacao)
        
        rankingsPorJurado[jurado.id] = {
          jurado: jurado.nome,
          ranking: rankingJurado,
          totalAvaliados: rankingJurado.filter(p => p.avaliado).length
        }
      }
    })

    return {
      geral: rankingGeral,
      porJurado: rankingsPorJurado
    }
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
        <h2 className="text-2xl font-bold text-gray-800">Ranking em Tempo Real</h2>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <div className="text-sm text-gray-600">
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            </div>
          )}
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
                  <p className="text-xl font-bold">{pratos.length}</p>
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
                  <p className="text-xl font-bold">{jurados.filter(j => j.ativo).length}</p>
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
                    {rankings.geral.reduce((sum, prato) => sum + prato.totalVotacoes, 0)}
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
                    {Math.round((rankings.geral.reduce((sum, prato) => sum + prato.totalVotacoes, 0) / (pratos.length * jurados.length)) * 100)}%
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
            {rankingAtual.map((prato, index) => {
              const posicao = index + 1
              const isAvaliado = selectedJurado === 'geral' ? prato.totalVotacoes > 0 : prato.avaliado

              return (
                <div
                  key={prato.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    isAvaliado 
                      ? 'bg-white border-gray-200 hover:shadow-md' 
                      : 'bg-gray-50 border-gray-100 opacity-60'
                  }`}
                >
                  {/* Posição */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold ${getRankingColor(posicao)}`}>
                    {getRankingIcon(posicao)}
                  </div>

                  {/* Imagem do prato */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={prato.imagem}
                      alt={prato.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informações do prato */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{prato.nome}</h3>
                    <p className="text-sm text-gray-600">{prato.restaurante}</p>
                    {prato.chef && (
                      <p className="text-xs text-gray-500">Chef: {prato.chef}</p>
                    )}
                  </div>

                  {/* Pontuação */}
                  <div className="text-right">
                    {isAvaliado ? (
                      <>
                        <div className="text-2xl font-bold text-gray-800">
                          {prato.pontuacao.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {prato.percentual.toFixed(1)}%
                        </div>
                        {selectedJurado === 'geral' && (
                          <div className="text-xs text-gray-500">
                            {prato.totalVotacoes} voto{prato.totalVotacoes !== 1 ? 's' : ''}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-400">
                        Não avaliado
                      </div>
                    )}
                  </div>

                  {/* Indicador de status */}
                  <div>
                    {isAvaliado ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Avaliado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Pendente
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {rankingAtual.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma avaliação encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RankingManager
