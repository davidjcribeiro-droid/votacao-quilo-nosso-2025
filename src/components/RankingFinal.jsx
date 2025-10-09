import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Trophy, Medal, Award, Star, Clock, Users, ChefHat, Download, RefreshCw } from 'lucide-react'

const RankingFinal = ({ dadosJurado, onReset }) => {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [filtroCategoria, setFiltroCategoria] = useState('todos')

  useEffect(() => {
    // Carregar avaliações do localStorage
    const avaliacoesStorage = JSON.parse(localStorage.getItem('avaliacoes') || '[]')
    
    // Dados mockados para demonstração (caso não haja avaliações reais)
    const avaliacoesMock = [
      {
        prato: { 
          id: 1, 
          nome: "Feijoada Completa Tradicional", 
          restaurante: "Casa da Feijoada",
          categoria: "Prato Principal"
        },
        media: 4.8,
        limpeza: 5,
        ambiente: 4,
        atendimento: 5,
        qualidadeGeral: 5,
        receitaParticipante: 5,
        observacoes: "Excelente feijoada, muito saborosa e bem apresentada.",
        jurado: { nome: "João Silva", categoria: "Júri Técnico Local" },
        dataAvaliacao: "2025-10-09T14:30:00.000Z"
      },
      {
        prato: { 
          id: 2, 
          nome: "Moqueca de Peixe Capixaba", 
          restaurante: "Sabores do Mar",
          categoria: "Prato Principal"
        },
        media: 4.6,
        limpeza: 5,
        ambiente: 4,
        atendimento: 4,
        qualidadeGeral: 5,
        receitaParticipante: 5,
        observacoes: "Moqueca autêntica com sabor excepcional.",
        jurado: { nome: "Maria Santos", categoria: "Júri Técnico Nacional" },
        dataAvaliacao: "2025-10-09T13:45:00.000Z"
      },
      {
        prato: { 
          id: 3, 
          nome: "Bobó de Camarão Baiano", 
          restaurante: "Tempero da Bahia",
          categoria: "Prato Principal"
        },
        media: 4.4,
        limpeza: 4,
        ambiente: 4,
        atendimento: 5,
        qualidadeGeral: 4,
        receitaParticipante: 5,
        observacoes: "Bobó cremoso e bem temperado.",
        jurado: { nome: "Carlos Lima", categoria: "Avaliador Convidado" },
        dataAvaliacao: "2025-10-09T12:20:00.000Z"
      },
      {
        prato: { 
          id: 4, 
          nome: "Pacu Assado com Farofa", 
          restaurante: "Pantanal Gourmet",
          categoria: "Prato Principal"
        },
        media: 4.2,
        limpeza: 4,
        ambiente: 4,
        atendimento: 4,
        qualidadeGeral: 4,
        receitaParticipante: 5,
        observacoes: "Peixe fresco e farofa especial muito boa.",
        jurado: { nome: "Ana Costa", categoria: "Júri Técnico Local" },
        dataAvaliacao: "2025-10-09T11:15:00.000Z"
      },
      {
        prato: { 
          id: 5, 
          nome: "Baião de Dois Nordestino", 
          restaurante: "Cozinha do Sertão",
          categoria: "Prato Principal"
        },
        media: 4.0,
        limpeza: 4,
        ambiente: 3,
        atendimento: 4,
        qualidadeGeral: 4,
        receitaParticipante: 5,
        observacoes: "Sabor tradicional nordestino autêntico.",
        jurado: { nome: "Pedro Oliveira", categoria: "Júri Técnico Nacional" },
        dataAvaliacao: "2025-10-09T10:30:00.000Z"
      },
      {
        prato: { 
          id: 6, 
          nome: "Tucumã com Tapioca", 
          restaurante: "Amazônia Autêntica",
          categoria: "Prato Principal"
        },
        media: 3.8,
        limpeza: 4,
        ambiente: 3,
        atendimento: 4,
        qualidadeGeral: 4,
        receitaParticipante: 4,
        observacoes: "Ingredientes regionais interessantes.",
        jurado: { nome: "Lucia Ferreira", categoria: "Avaliador Convidado" },
        dataAvaliacao: "2025-10-09T09:45:00.000Z"
      }
    ]

    // Usar avaliações reais se existirem, senão usar mock
    const avaliacoesFinais = avaliacoesStorage.length > 0 ? avaliacoesStorage : avaliacoesMock
    
    // Ordenar por média (maior para menor)
    const avaliacoesOrdenadas = avaliacoesFinais.sort((a, b) => b.media - a.media)
    setAvaliacoes(avaliacoesOrdenadas)
  }, [])

  const getRankIcon = (posicao) => {
    switch (posicao) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">{posicao}</div>
    }
  }

  const getRankColor = (posicao) => {
    switch (posicao) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
      default:
        return 'bg-white border border-gray-200'
    }
  }

  const getMediaColor = (media) => {
    if (media >= 4.5) return 'text-green-600'
    if (media >= 4.0) return 'text-yellow-600'
    if (media >= 3.5) return 'text-orange-600'
    return 'text-red-600'
  }

  const exportarRelatorio = () => {
    const relatorio = {
      evento: "O Quilo é Nosso 2025",
      dataGeracao: new Date().toISOString(),
      jurado: dadosJurado,
      totalAvaliacoes: avaliacoes.length,
      ranking: avaliacoes.map((avaliacao, index) => ({
        posicao: index + 1,
        ...avaliacao
      }))
    }

    const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ranking-oqn-2025-${dadosJurado?.nome?.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const avaliacoesFiltradas = filtroCategoria === 'todos' 
    ? avaliacoes 
    : avaliacoes.filter(av => av.prato.categoria === filtroCategoria)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Ranking Final
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                O Quilo é Nosso 2025 • Avaliado por: <span className="font-medium">{dadosJurado?.nome}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={exportarRelatorio}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar Relatório
              </Button>
              <Button
                onClick={onReset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Nova Avaliação
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{avaliacoes.length}</div>
                  <div className="text-sm text-gray-600">Pratos Avaliados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {avaliacoes.length > 0 ? (avaliacoes.reduce((acc, av) => acc + av.media, 0) / avaliacoes.length).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-gray-600">Média Geral</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {avaliacoes.length > 0 ? avaliacoes[0]?.media?.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-gray-600">Melhor Nota</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {new Set(avaliacoes.map(av => av.prato.restaurante)).size}
                  </div>
                  <div className="text-sm text-gray-600">Restaurantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pódio dos 3 Primeiros */}
        {avaliacoes.length >= 3 && (
          <Card className="mb-8 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 text-center">
                🏆 Pódio dos Campeões 🏆
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-end gap-4">
                {/* 2º Lugar */}
                <div className="text-center">
                  <div className="w-24 h-32 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg flex items-end justify-center pb-4">
                    <Medal className="w-8 h-8 text-white" />
                  </div>
                  <div className="mt-2">
                    <div className="font-bold text-sm">{avaliacoes[1]?.prato.nome}</div>
                    <div className="text-xs text-gray-600">{avaliacoes[1]?.prato.restaurante}</div>
                    <div className="text-lg font-bold text-gray-600">{avaliacoes[1]?.media.toFixed(1)}</div>
                  </div>
                </div>

                {/* 1º Lugar */}
                <div className="text-center">
                  <div className="w-24 h-40 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-end justify-center pb-4">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <div className="mt-2">
                    <div className="font-bold text-sm">{avaliacoes[0]?.prato.nome}</div>
                    <div className="text-xs text-gray-600">{avaliacoes[0]?.prato.restaurante}</div>
                    <div className="text-xl font-bold text-yellow-600">{avaliacoes[0]?.media.toFixed(1)}</div>
                  </div>
                </div>

                {/* 3º Lugar */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-t from-amber-500 to-amber-600 rounded-t-lg flex items-end justify-center pb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="mt-2">
                    <div className="font-bold text-sm">{avaliacoes[2]?.prato.nome}</div>
                    <div className="text-xs text-gray-600">{avaliacoes[2]?.prato.restaurante}</div>
                    <div className="text-lg font-bold text-amber-600">{avaliacoes[2]?.media.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ranking Completo */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Ranking Completo
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {avaliacoesFiltradas.map((avaliacao, index) => (
                <div
                  key={avaliacao.prato.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${getRankColor(index + 1)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="text-lg font-bold">#{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{avaliacao.prato.nome}</h3>
                        <p className="text-sm opacity-80">{avaliacao.prato.restaurante}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm opacity-70">
                          <span>Avaliado por: {avaliacao.jurado.nome}</span>
                          <span>•</span>
                          <span>{new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${index < 3 ? 'text-white' : getMediaColor(avaliacao.media)}`}>
                        {avaliacao.media.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">/ 5.0</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detalhes dos Critérios */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">Limpeza</div>
                        <div className="text-lg">{avaliacao.limpeza}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Ambiente</div>
                        <div className="text-lg">{avaliacao.ambiente}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Atendimento</div>
                        <div className="text-lg">{avaliacao.atendimento}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Qualidade</div>
                        <div className="text-lg">{avaliacao.qualidadeGeral}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Receita</div>
                        <div className="text-lg">{avaliacao.receitaParticipante}</div>
                      </div>
                    </div>
                    
                    {avaliacao.observacoes && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <div className="text-sm font-medium mb-1">Observações:</div>
                        <div className="text-sm opacity-80">{avaliacao.observacoes}</div>
                      </div>
                    )}
                  </div>
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
