import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Trophy, Download, RotateCcw, Star, Medal, Award, Crown } from 'lucide-react'

const RankingFinal = ({ dadosJurado, onReiniciar }) => {
  const [avaliacoes, setAvaliacoes] = useState([])

  const criterios = [
    { key: 'originalidade', nome: 'Originalidade', peso: 2 },
    { key: 'receita', nome: 'Receita', peso: 2 },
    { key: 'apresentacao', nome: 'Apresentação', peso: 1 },
    { key: 'harmonia', nome: 'Harmonia', peso: 2 },
    { key: 'sabor', nome: 'Sabor', peso: 3 },
    { key: 'adequacao', nome: 'Adequação', peso: 3 }
  ]

  const calcularPontuacaoTotal = (avaliacao) => {
    return criterios.reduce((total, criterio) => {
      const nota = avaliacao[criterio.key] || 0
      return total + (nota * criterio.peso)
    }, 0)
  }

  useEffect(() => {
    // Carregar avaliações do localStorage
    const avaliacoesStorage = localStorage.getItem('avaliacoes')
    if (avaliacoesStorage) {
      const avaliacoesData = JSON.parse(avaliacoesStorage)
      setAvaliacoes(avaliacoesData)
    } else {
      // Dados de exemplo para demonstração
      const dadosExemplo = [
        {
          prato: { id: 1, nome: 'Frango Assado com Batatas', restaurante: 'Casa da Feijoada' },
          jurado: { nome: 'David' },
          originalidade: 4, receita: 5, apresentacao: 3, harmonia: 4, sabor: 4, adequacao: 4,
          dataAvaliacao: '09/10/2025'
        },
        {
          prato: { id: 2, nome: 'Café da Manhã Inglês', restaurante: 'Sabores Internacionais' },
          jurado: { nome: 'Maria' },
          originalidade: 5, receita: 5, apresentacao: 5, harmonia: 5, sabor: 5, adequacao: 5,
          dataAvaliacao: '09/10/2025'
        },
        {
          prato: { id: 3, nome: 'Sopa Oriental de Ervilha', restaurante: 'Pantanal Gourmet' },
          jurado: { nome: 'João' },
          originalidade: 3, receita: 4, apresentacao: 4, harmonia: 4, sabor: 5, adequacao: 4,
          dataAvaliacao: '09/10/2025'
        }
      ]
      setAvaliacoes(dadosExemplo)
    }
  }, [])

  // Agrupar avaliações por prato e calcular médias
  const pratosComMedias = () => {
    const pratosPorId = {}
    
    avaliacoes.forEach(avaliacao => {
      const pratoId = avaliacao.prato.id
      if (!pratosPorId[pratoId]) {
        pratosPorId[pratoId] = {
          prato: avaliacao.prato,
          avaliacoes: [],
          pontuacaoTotal: 0,
          numeroAvaliacoes: 0
        }
      }
      
      pratosPorId[pratoId].avaliacoes.push(avaliacao)
      pratosPorId[pratoId].pontuacaoTotal += calcularPontuacaoTotal(avaliacao)
      pratosPorId[pratoId].numeroAvaliacoes += 1
    })

    // Calcular média e ordenar
    return Object.values(pratosPorId)
      .map(item => ({
        ...item,
        pontuacaoMedia: item.numeroAvaliacoes > 0 ? item.pontuacaoTotal / item.numeroAvaliacoes : 0
      }))
      .sort((a, b) => b.pontuacaoMedia - a.pontuacaoMedia)
  }

  const pratosRankeados = pratosComMedias()

  const exportarCSV = () => {
    const headers = [
      'Posição', 'Prato', 'Restaurante', 'Jurado', 'Pontuação Final',
      'Originalidade', 'Receita', 'Apresentação', 'Harmonia', 'Sabor', 'Adequação',
      'Data Avaliação'
    ]

    const linhas = []
    
    pratosRankeados.forEach((item, index) => {
      item.avaliacoes.forEach(avaliacao => {
        const linha = [
          index + 1,
          avaliacao.prato.nome,
          avaliacao.prato.restaurante,
          avaliacao.jurado.nome,
          calcularPontuacaoTotal(avaliacao),
          avaliacao.originalidade * 2, // pontos = estrelas × peso
          avaliacao.receita * 2,
          avaliacao.apresentacao * 1,
          avaliacao.harmonia * 2,
          avaliacao.sabor * 3,
          avaliacao.adequacao * 3,
          avaliacao.dataAvaliacao
        ]
        linhas.push(linha)
      })
    })

    const csvContent = [headers, ...linhas]
      .map(linha => linha.map(campo => `"${campo}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `ranking_quilo_nosso_2025_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const estatisticas = {
    totalPratos: pratosRankeados.length,
    mediaGeral: pratosRankeados.length > 0 
      ? pratosRankeados.reduce((sum, item) => sum + item.pontuacaoMedia, 0) / pratosRankeados.length 
      : 0,
    melhorNota: pratosRankeados.length > 0 ? pratosRankeados[0].pontuacaoMedia : 0,
    totalJurados: new Set(avaliacoes.map(av => av.jurado.nome)).size
  }

  const getPodiumIcon = (posicao) => {
    switch(posicao) {
      case 0: return <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
      case 1: return <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
      case 2: return <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
      default: return null
    }
  }

  const getPodiumColor = (posicao) => {
    switch(posicao) {
      case 0: return 'from-yellow-400 to-yellow-600'
      case 1: return 'from-gray-300 to-gray-500'
      case 2: return 'from-amber-400 to-amber-600'
      default: return 'from-gray-200 to-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-yellow-50 mobile-safe">
      <div className="mobile-container py-4">
        {/* Header Mobile */}
        <div className="mobile-header bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Ranking Final
              </h1>
              <p className="text-gray-600 text-sm">
                O Quilo é Nosso 2025 • Avaliado por: <span className="font-semibold text-orange-600">{dadosJurado?.nome}</span>
              </p>
            </div>
            <div className="mobile-nav">
              <Button 
                onClick={exportarCSV}
                variant="outline" 
                className="mobile-button flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </Button>
              <Button 
                onClick={onReiniciar}
                variant="outline" 
                className="mobile-button flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Nova Avaliação
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas Mobile */}
        <div className="mobile-stats mb-6">
          <Card className="mobile-card p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{estatisticas.totalPratos}</div>
            <div className="text-xs sm:text-sm text-gray-600">Pratos Avaliados</div>
          </Card>

          <Card className="mobile-card p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{estatisticas.mediaGeral.toFixed(1)}</div>
            <div className="text-xs sm:text-sm text-gray-600">Média Geral</div>
          </Card>

          <Card className="mobile-card p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{estatisticas.melhorNota.toFixed(1)}</div>
            <div className="text-xs sm:text-sm text-gray-600">Melhor Nota</div>
          </Card>

          <Card className="mobile-card p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{estatisticas.totalJurados}</div>
            <div className="text-xs sm:text-sm text-gray-600">Jurados</div>
          </Card>
        </div>

        {/* Pódio Mobile */}
        {pratosRankeados.length >= 3 && (
          <Card className="mobile-card shadow-lg mb-6">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Pódio dos Campeões
                <Trophy className="w-5 h-5 text-yellow-500" />
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 2º Lugar */}
                <div className="order-2 sm:order-1">
                  <div className={`bg-gradient-to-b ${getPodiumColor(1)} rounded-lg p-4 text-center text-white shadow-lg h-32 sm:h-40 flex flex-col justify-between`}>
                    <div className="flex justify-center">
                      {getPodiumIcon(1)}
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base mobile-truncate">{pratosRankeados[1].prato.nome}</div>
                      <div className="text-xs sm:text-sm opacity-90 mobile-truncate">{pratosRankeados[1].prato.restaurante}</div>
                      <div className="text-lg sm:text-xl font-bold mt-1">{pratosRankeados[1].pontuacaoMedia.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                {/* 1º Lugar */}
                <div className="order-1 sm:order-2">
                  <div className={`bg-gradient-to-b ${getPodiumColor(0)} rounded-lg p-4 text-center text-white shadow-lg h-36 sm:h-48 flex flex-col justify-between`}>
                    <div className="flex justify-center">
                      {getPodiumIcon(0)}
                    </div>
                    <div>
                      <div className="font-bold text-base sm:text-lg mobile-truncate">{pratosRankeados[0].prato.nome}</div>
                      <div className="text-sm opacity-90 mobile-truncate">{pratosRankeados[0].prato.restaurante}</div>
                      <div className="text-xl sm:text-2xl font-bold mt-2">{pratosRankeados[0].pontuacaoMedia.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                {/* 3º Lugar */}
                <div className="order-3">
                  <div className={`bg-gradient-to-b ${getPodiumColor(2)} rounded-lg p-4 text-center text-white shadow-lg h-28 sm:h-36 flex flex-col justify-between`}>
                    <div className="flex justify-center">
                      {getPodiumIcon(2)}
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base mobile-truncate">{pratosRankeados[2].prato.nome}</div>
                      <div className="text-xs sm:text-sm opacity-90 mobile-truncate">{pratosRankeados[2].prato.restaurante}</div>
                      <div className="text-lg sm:text-xl font-bold mt-1">{pratosRankeados[2].pontuacaoMedia.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ranking Completo Mobile */}
        <Card className="mobile-card shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Ranking Completo</h2>
            
            <div className="space-y-3 sm:space-y-4">
              {pratosRankeados.map((item, index) => (
                <div key={item.prato.id}>
                  {item.avaliacoes.map((avaliacao, avalIndex) => (
                    <Card key={`${item.prato.id}-${avalIndex}`} className={`${
                      index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300' :
                      index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' :
                      index === 2 ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300' :
                      'bg-white border-gray-200'
                    } border-2 mb-3`}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-500' :
                              index === 2 ? 'bg-amber-500' :
                              'bg-gray-400'
                            }`}>
                              #{index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-sm sm:text-base text-gray-800">{avaliacao.prato.nome}</h3>
                              <p className="text-xs sm:text-sm text-orange-600">{avaliacao.prato.restaurante}</p>
                              <p className="text-xs text-gray-500">Avaliado por: {avaliacao.jurado.nome} • {avaliacao.dataAvaliacao}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:items-end gap-2">
                            <div className="text-center sm:text-right">
                              <div className="text-xl sm:text-2xl font-bold text-gray-800">{calcularPontuacaoTotal(avaliacao)}</div>
                              <div className="text-xs text-gray-600">/ 65 pts</div>
                            </div>
                            
                            {/* Critérios em Mobile */}
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-medium">{avaliacao.originalidade * 2}</div>
                                <div className="text-gray-500">Orig.</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{avaliacao.receita * 2}</div>
                                <div className="text-gray-500">Rec.</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{avaliacao.apresentacao * 1}</div>
                                <div className="text-gray-500">Apres.</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{avaliacao.harmonia * 2}</div>
                                <div className="text-gray-500">Harm.</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{avaliacao.sabor * 3}</div>
                                <div className="text-gray-500">Sabor</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{avaliacao.adequacao * 3}</div>
                                <div className="text-gray-500">Adeq.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RankingFinal
