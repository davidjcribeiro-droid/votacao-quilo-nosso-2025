import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowLeft, ArrowRight, Clock, Users, CheckCircle, Lock, Trophy, Star, User, CheckCircle2, Clock4 } from 'lucide-react'
import adminDataService from '../services/AdminDataService.js'

const SelecaoPratos = ({ dadosJurado, onNext, onBack, onAvaliarPrato }) => {
  const [pratos, setPratos] = useState([])
  const [pratosOriginal] = useState([
    {
      id: 1,
      nome: 'Presunto Artesanal de Frango com Pequi',
      restaurante: 'Junior Cozinha Brasileira',
      descricao: 'Presunto artesanal de frango com pequi recheado, empanado em semente de abóbora, acompanhado de musseline de agrião e crispy de casca de maçã',
      tempo: '90 min',
      porcoes: '4-6 pessoas',
      categoria: 'Prato Principal',
      imagem: '/images/pratos/junior_cozinha_brasileira.png'
    },
    {
      id: 2,
      nome: 'Café da Manhã Inglês Completo',
      restaurante: 'Sabores Internacionais',
      descricao: 'Café da manhã tradicional inglês com ovos, bacon, linguiça, feijão e cogumelos',
      tempo: '30 min',
      porcoes: '1-2 pessoas',
      categoria: 'Café da Manhã',
      imagem: '/images/pratos/prato-de-pequeno-almoco-ingles.jpg'
    },
    {
      id: 3,
      nome: 'Salada Caesar com Camarão',
      restaurante: 'Tempero da Bahia',
      descricao: 'Salada caesar clássica com camarões grelhados, parmesão e croutons artesanais',
      tempo: '20 min',
      porcoes: '2-3 pessoas',
      categoria: 'Salada',
      imagem: '/images/pratos/camarao-caesar-salada-vista-superior.jpg'
    },
    {
      id: 4,
      nome: 'Sopa Oriental de Ervilha',
      restaurante: 'Pantanal Gourmet',
      descricao: 'Sopa cremosa de ervilha com temperos orientais e carne desfiada',
      tempo: '35 min',
      porcoes: '3-4 pessoas',
      categoria: 'Sopa',
      imagem: '/images/pratos/sopa-de-ervilha-oriental-deliciosa-antropofaga-com-carne-em-uma-tabela-de-madeira-vista-de-alto-angulo.jpg'
    },
    {
      id: 5,
      nome: 'Penne com Molho de Tomate',
      restaurante: 'Massa & Arte',
      descricao: 'Macarrão penne al dente com molho de tomate artesanal, carne e queijo parmesão',
      tempo: '25 min',
      porcoes: '2-3 pessoas',
      categoria: 'Massa',
      imagem: '/images/pratos/macarrao-penne-com-molho-de-tomate-carne-e-queijo-ralado.jpg'
    },
    {
      id: 6,
      nome: 'Salada Caesar Gourmet',
      restaurante: 'Verde & Sabor',
      descricao: 'Salada caesar premium com molho especial da casa e parmesão envelhecido',
      tempo: '15 min',
      porcoes: '1-2 pessoas',
      categoria: 'Salada',
      imagem: '/images/pratos/salada-caesar-com-tomate-e-pano-em-prato-triangular.jpg'
    }
  ])

  // Carregar pratos do painel administrativo
  useEffect(() => {
    try {
      const pratosAdmin = adminDataService.getPratos()
      if (pratosAdmin && pratosAdmin.length > 0) {
        // Usar dados do painel administrativo
        setPratos(pratosAdmin)
      } else {
        // Fallback para dados originais se não houver dados no admin
        setPratos(pratosOriginal)
      }
    } catch (error) {
      console.error('Erro ao carregar pratos do admin:', error)
      // Usar dados originais em caso de erro
      setPratos(pratosOriginal)
    }
  }, [])

  const criterios = [
    'originalidade',
    'receita', 
    'apresentacao',
    'harmonia',
    'sabor',
    'adequacao'
  ]

  const pratoJaVotado = (pratoId) => {
    if (!dadosJurado?.id) return false
    
    const chaveVotacoes = `votacoes_jurado_${dadosJurado.id}`
    const votacoesSalvas = localStorage.getItem(chaveVotacoes)
    
    if (votacoesSalvas) {
      const votacoes = JSON.parse(votacoesSalvas)
      return votacoes[pratoId] && votacoes[pratoId].completa
    }
    
    return false
  }

  const contarQuesitosVotados = (pratoId) => {
    if (!dadosJurado?.id) return 0
    
    const chaveVotacoes = `votacoes_jurado_${dadosJurado.id}`
    const votacoesSalvas = localStorage.getItem(chaveVotacoes)
    
    if (votacoesSalvas) {
      const votacoes = JSON.parse(votacoesSalvas)
      const votacaoPrato = votacoes[pratoId]
      
      if (votacaoPrato) {
        // Contar critérios que têm nota > 0 (foram avaliados)
        return criterios.filter(criterio => 
          votacaoPrato[criterio] && votacaoPrato[criterio] > 0
        ).length
      }
    }
    
    return 0
  }

  const todosVotados = () => {
    return pratos.every(prato => pratoJaVotado(prato.id))
  }

  const contarPratosAvaliados = () => {
    return pratos.filter(prato => pratoJaVotado(prato.id)).length
  }

  const handleAvaliarPrato = (prato) => {
    onAvaliarPrato(prato)
  }

  const handleVerRanking = () => {
    onNext()
  }

  const pratosAvaliados = contarPratosAvaliados()
  const totalJurados = 5 // Número fixo de jurados

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-yellow-50 mobile-safe">
      <div className="mobile-container py-4 sm:py-6">
        {/* Header Mobile-Friendly */}
        <div className="mobile-header bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                Seleção de Pratos
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Jurado: <span className="font-semibold text-orange-600">{dadosJurado?.nome}</span>
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">{pratosAvaliados} de {pratos.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Pratos Avaliados</div>
            </div>
          </div>
        </div>

        {/* Estatísticas Mobile */}
        <div className="mobile-stats mb-6">
          <Card className="mobile-card p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{pratos.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
          </Card>

          <Card className="mobile-card p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock4 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{pratos.length - pratosAvaliados}</div>
            <div className="text-xs sm:text-sm text-gray-600">Pendentes</div>
          </Card>

          <Card className="mobile-card p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{pratosAvaliados}</div>
            <div className="text-xs sm:text-sm text-gray-600">Avaliados</div>
          </Card>

          <Card className="mobile-card p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{totalJurados}</div>
            <div className="text-xs sm:text-sm text-gray-600">Jurados</div>
          </Card>
        </div>

        {/* Pratos Pendentes */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock4 className="w-5 h-5 text-orange-500" />
            Pratos Pendentes
          </h2>
          
          <div className="mobile-grid">
            {pratos.filter(prato => !pratoJaVotado(prato.id)).map(prato => {
              const quesitosVotados = contarQuesitosVotados(prato.id)
              const quesitosRestantes = criterios.length - quesitosVotados
              
              return (
                <Card key={prato.id} className="mobile-card shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
                    {/* Status e Contador de Quesitos */}
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                        Pendente
                      </Badge>
                      {quesitosVotados > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                          {quesitosVotados}/6 quesitos
                        </Badge>
                      )}
                    </div>
                    
                    {/* Imagem do Prato - Maior */}
                    <div className="w-full h-48 sm:h-56">
                      <img 
                        src={prato.imagem} 
                        alt={prato.nome}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    </div>
                    
                    {/* Informações do Prato */}
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2">{prato.nome}</h3>
                      <p className="text-orange-600 font-medium text-sm sm:text-base mb-3">{prato.restaurante}</p>
                      
                      {/* Contador de Quesitos em Destaque */}
                      {quesitosVotados > 0 ? (
                        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-l-4 border-blue-400">
                          <div className="text-center mb-2">
                            <div className="text-2xl font-bold text-blue-600">{quesitosVotados}/6</div>
                            <div className="text-sm text-blue-800 font-medium">Quesitos Votados</div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="font-medium">Enviados: {quesitosVotados}</span>
                            </div>
                            <div className="flex items-center gap-2 text-orange-700">
                              <Clock4 className="w-4 h-4" />
                              <span className="font-medium">Faltam: {quesitosRestantes}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-gray-400">0/6</div>
                          <div className="text-sm text-gray-600">Nenhum quesito votado</div>
                        </div>
                      )}
                      
                      {/* Informações Adicionais - Ocultas conforme solicitado */}
                    </div>
                    
                    {/* Botão de Ação */}
                    <Button 
                      onClick={() => handleAvaliarPrato(prato)}
                      className="mobile-button w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                    >
                      {quesitosVotados > 0 ? 'Continuar Avaliação' : 'Avaliar Prato'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Pratos Já Avaliados */}
        {pratosAvaliados > 0 && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Pratos Já Avaliados
            </h2>
            
            <div className="mobile-grid">
              {pratos.filter(prato => pratoJaVotado(prato.id)).map(prato => (
                <Card key={prato.id} className="mobile-card shadow-md opacity-75">
                  <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
                    {/* Status Completo */}
                    <div className="flex items-start justify-between">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        Avaliado
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
                        6/6 quesitos
                      </Badge>
                    </div>
                    
                    {/* Imagem do Prato */}
                    <div className="w-full h-48 sm:h-56">
                      <img 
                        src={prato.imagem} 
                        alt={prato.nome}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    </div>
                    
                    {/* Informações do Prato */}
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2">{prato.nome}</h3>
                      <p className="text-orange-600 font-medium text-sm sm:text-base mb-3">{prato.restaurante}</p>
                      
                      {/* Status Completo em Destaque */}
                      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                        <div className="text-center mb-2">
                          <div className="text-2xl font-bold text-green-600">6/6</div>
                          <div className="text-sm text-green-800 font-medium">Avaliação Completa</div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Todos os quesitos enviados</span>
                        </div>
                      </div>
                      
                      {/* Informações Adicionais - Ocultas conforme solicitado */}
                    </div>
                    
                    {/* Status Bloqueado */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <Lock className="w-4 h-4" />
                      <span>Avaliação finalizada - não pode ser alterada</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Botão Ver Ranking */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="mobile-button flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          {todosVotados() ? (
            <Button 
              onClick={handleVerRanking}
              className="mobile-button bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Ver Ranking Final
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm font-medium">
                Avalie todos os pratos para ver o ranking final
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SelecaoPratos
