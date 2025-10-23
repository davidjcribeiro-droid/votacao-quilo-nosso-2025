import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowLeft, Star, Send, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import adminDataService from '../services/AdminDataService.js'

const VotacaoAvaliacao = ({ dadosJurado, pratoSelecionado, onNext, onBack }) => {
  const [avaliacao, setAvaliacao] = useState({
    originalidade: 0,
    receita: 0,
    apresentacao: 0,
    harmonia: 0,
    sabor: 0,
    adequacao: 0
  })

  const [criteriosEnviados, setCriteriosEnviados] = useState({})
  const [hoveredCriteria, setHoveredCriteria] = useState(null)
  const [hoveredStar, setHoveredStar] = useState(null)
  const [mostrarReceita, setMostrarReceita] = useState(false)

  const criterios = [
    {
      key: 'originalidade',
      nome: 'Originalidade',
      descricao: 'Criatividade e inovação na preparação do prato',
      icon: '💡',
      color: 'purple',
      peso: 2
    },
    {
      key: 'receita',
      nome: 'Receita (execução e produtos)',
      descricao: 'Qualidade da execução e dos ingredientes utilizados',
      icon: '📋',
      color: 'blue',
      peso: 2
    },
    {
      key: 'apresentacao',
      nome: 'Apresentação',
      descricao: 'Visual, organização e disposição do prato',
      icon: '🎨',
      color: 'green',
      peso: 1
    },
    {
      key: 'harmonia',
      nome: 'Harmonia do prato',
      descricao: 'Equilíbrio entre sabores, texturas e elementos',
      icon: '⚖️',
      color: 'yellow',
      peso: 2
    },
    {
      key: 'sabor',
      nome: 'Sabor',
      descricao: 'Qualidade gustativa e palatabilidade do prato',
      icon: '👅',
      color: 'red',
      peso: 3
    },
    {
      key: 'adequacao',
      nome: 'Adequação do prato ao serviço a quilo',
      descricao: 'Praticidade e adequação ao formato de self-service',
      icon: '🍽️',
      color: 'orange',
      peso: 3
    }
  ]

  // Receita fictícia para demonstração
  const receita = {
    ingredientes: [
      "1 frango inteiro (1,5kg)",
      "4 batatas médias",
      "2 cebolas grandes", 
      "3 dentes de alho",
      "Ervas finas (tomilho, alecrim)",
      "Azeite extra virgem",
      "Sal e pimenta do reino"
    ],
    preparo: [
      "Tempere o frango com sal, pimenta e ervas finas",
      "Deixe marinar por 2 horas",
      "Corte as batatas e cebolas em pedaços médios",
      "Preaqueça o forno a 200°C",
      "Coloque o frango em assadeira com as batatas ao redor",
      "Regue com azeite e leve ao forno por 45 minutos",
      "Vire o frango na metade do tempo",
      "Sirva quente com as batatas douradas"
    ]
  }

  useEffect(() => {
    // Carregar avaliações já salvas para este prato e jurado
    if (dadosJurado?.id && pratoSelecionado?.id) {
      console.log("Salvando voto para jurado ID:", dadosJurado.id);
    const chaveVotacoes = `votacoes_jurado_${dadosJurado.id}`
      const votacoesSalvas = localStorage.getItem(chaveVotacoes)
      
      if (votacoesSalvas) {
        const votacoes = JSON.parse(votacoesSalvas)
        const avaliacaoPrato = votacoes[pratoSelecionado.id]
        
        if (avaliacaoPrato) {
          // Carregar avaliações já feitas
          setAvaliacao(prev => ({
            ...prev,
            ...avaliacaoPrato
          }))
          
          // Marcar critérios já enviados
          const enviados = {}
          criterios.forEach(criterio => {
            if (avaliacaoPrato[criterio.key] && avaliacaoPrato[criterio.key] > 0) {
              enviados[criterio.key] = true
            }
          })
          setCriteriosEnviados(enviados)
        }
      }
    }
  }, [dadosJurado, pratoSelecionado])

  const handleStarClick = (criterio, nota) => {
    // Só permite alterar se o critério ainda não foi enviado
    if (!criteriosEnviados[criterio]) {
      setAvaliacao(prev => ({
        ...prev,
        [criterio]: nota
      }))
    }
  }

  const handleStarHover = (criterio, nota) => {
    // Só permite hover se não foi enviado
    if (!criteriosEnviados[criterio]) {
      setHoveredCriteria(criterio)
      setHoveredStar(nota)
    }
  }

  const handleStarLeave = () => {
    setHoveredCriteria(null)
    setHoveredStar(null)
  }

  const renderStars = (criterio) => {
    const currentValue = avaliacao[criterio.key]
    const isEnviado = criteriosEnviados[criterio.key]
    
    return (
      <div className="flex gap-1 justify-center sm:justify-start">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= currentValue
          const isHovered = hoveredCriteria === criterio.key && star <= hoveredStar
          
          return (
            <Star
              key={star}
              className={`mobile-star transition-all duration-200 ${
                isEnviado 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'cursor-pointer'
              } ${
                isActive || isHovered 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
              onClick={() => handleStarClick(criterio.key, star)}
              onMouseEnter={() => handleStarHover(criterio.key, star)}
              onMouseLeave={handleStarLeave}
            />
          )
        })}
      </div>
    )
  }

  const handleEnviarCriterio = async (criterio) => {
    if (avaliacao[criterio.key] === 0) {
      alert('Por favor, selecione uma nota antes de enviar.')
      return
    }

    // Salvar avaliação individual no localStorage
    console.log("Salvando voto para jurado ID:", dadosJurado.id);
    const chaveVotacoes = `votacoes_jurado_${dadosJurado.id}`
    const votacoesSalvas = localStorage.getItem(chaveVotacoes) || '{}'
    const votacoes = JSON.parse(votacoesSalvas)

    // Inicializar avaliação do prato se não existir
    if (!votacoes[pratoSelecionado.id]) {
      votacoes[pratoSelecionado.id] = {
        originalidade: 0,
        receita: 0,
        apresentacao: 0,
        harmonia: 0,
        sabor: 0,
        adequacao: 0,
        prato: pratoSelecionado,
        jurado: dadosJurado,
        dataInicio: new Date().toISOString()
      }
    }

    // Atualizar critério específico
    votacoes[pratoSelecionado.id][criterio.key] = avaliacao[criterio.key]
    votacoes[pratoSelecionado.id].dataUltimaAtualizacao = new Date().toISOString()

    // Verificar se todos os critérios foram preenchidos
    const todosPreenchidos = criterios.every(c => 
      votacoes[pratoSelecionado.id][c.key] > 0
    )

    if (todosPreenchidos) {
      votacoes[pratoSelecionado.id].completa = true
      votacoes[pratoSelecionado.id].dataCompleta = new Date().toISOString()
    }

    localStorage.setItem(chaveVotacoes, JSON.stringify(votacoes))

    // Marcar critério como enviado
    setCriteriosEnviados(prev => ({
      ...prev,
      [criterio.key]: true
    }))

    // Salvar avaliação completa usando Supabase
    if (todosPreenchidos) {
      const avaliacaoCompleta = {
        prato_id: pratoSelecionado.id,
        jurado_id: dadosJurado.id,
        jurado_nome: dadosJurado.nome,
        originalidade: votacoes[pratoSelecionado.id].originalidade,
        receita: votacoes[pratoSelecionado.id].receita,
        apresentacao: votacoes[pratoSelecionado.id].apresentacao,
        harmonia: votacoes[pratoSelecionado.id].harmonia,
        sabor: votacoes[pratoSelecionado.id].sabor,
        adequacao: votacoes[pratoSelecionado.id].adequacao,
        completa: true
      }

      // Salvar no Supabase
      try {
        await adminDataService.addAvaliacao(avaliacaoCompleta)
        alert('Prato completamente avaliado! Todos os critérios foram enviados.')
      } catch (error) {
        console.error('Erro ao salvar avaliação:', error)
        alert('Erro ao salvar avaliação. Tente novamente.')
      }
    } else {
      alert(`Critério "${criterio.nome}" enviado com sucesso!`)
    }
  }

  const getStatusCriterio = (criterio) => {
    if (criteriosEnviados[criterio.key]) {
      return { status: 'enviado', texto: 'Enviado', cor: 'text-green-600' }
    } else if (avaliacao[criterio.key] > 0) {
      return { status: 'preenchido', texto: 'Pronto para enviar', cor: 'text-blue-600' }
    } else {
      return { status: 'vazio', texto: 'Não avaliado', cor: 'text-gray-500' }
    }
  }

  const contarCriteriosEnviados = () => {
    return Object.keys(criteriosEnviados).length
  }

  if (!pratoSelecionado) {
    return <div>Erro: Nenhum prato selecionado</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-yellow-50 mobile-safe">
      <div className="mobile-container py-4">
        {/* Header Mobile */}
        <div className="mobile-header bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Avaliação do Prato</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Jurado: <span className="font-semibold text-orange-600">{dadosJurado?.nome}</span>
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{contarCriteriosEnviados()} de 6</div>
              <div className="text-xs sm:text-sm text-gray-600">Critérios Enviados</div>
            </div>
          </div>
        </div>

        {/* Card do Prato Mobile */}
        <Card className="mobile-card shadow-lg mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <img 
                src={pratoSelecionado.imagem} 
                alt={pratoSelecionado.nome}
                className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{pratoSelecionado.nome}</h2>
                <p className="text-orange-600 font-medium mb-4">{pratoSelecionado.restaurante}</p>
                
                {/* Dropdown da Receita Mobile */}
                <div className="mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setMostrarReceita(!mostrarReceita)}
                    className="mobile-button flex items-center gap-2"
                  >
                    Ver Receita
                    {mostrarReceita ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  
                  {mostrarReceita && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Ingredientes:</h4>
                          <ul className="text-sm space-y-1">
                            {receita.ingredientes.map((ingrediente, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-orange-500">•</span>
                                {ingrediente}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Modo de Preparo:</h4>
                          <ol className="text-sm space-y-1">
                            {receita.preparo.map((passo, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-orange-500 font-medium">{index + 1}.</span>
                                {passo}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critérios de Avaliação Mobile */}
        <Card className="mobile-card shadow-lg mb-4">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-gray-700 text-lg">
              <Star className="w-5 h-5 text-yellow-500" />
              Critérios de Avaliação
            </CardTitle>
            <p className="text-sm text-gray-600">Avalie e envie cada critério individualmente</p>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {criterios.map((criterio) => {
              const status = getStatusCriterio(criterio)
              const isEnviado = criteriosEnviados[criterio.key]
              
              return (
                <div key={criterio.key} className={`border rounded-lg p-4 ${
                  isEnviado ? 'bg-green-50 border-green-200' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl sm:text-2xl">{criterio.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                          {criterio.nome}
                          {isEnviado && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">{criterio.descricao}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-col items-center sm:items-start gap-2">
                        {renderStars(criterio)}
                        <div className={`text-xs sm:text-sm font-medium ${status.cor} text-center sm:text-left`}>
                          {status.texto}
                        </div>
                      </div>
                      
                      {isEnviado ? (
                        <Button disabled className="mobile-button bg-green-100 text-green-700 cursor-not-allowed">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Enviado
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleEnviarCriterio(criterio)}
                          disabled={avaliacao[criterio.key] === 0}
                          className={`mobile-button ${
                            avaliacao[criterio.key] > 0
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Botão de Voltar Mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="mobile-button flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Seleção
          </Button>

          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-600 mb-2">
              {contarCriteriosEnviados() === 6 
                ? 'Prato completamente avaliado!' 
                : `${6 - contarCriteriosEnviados()} critérios restantes`
              }
            </p>
            {contarCriteriosEnviados() === 6 && (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Avaliação Completa
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotacaoAvaliacao
