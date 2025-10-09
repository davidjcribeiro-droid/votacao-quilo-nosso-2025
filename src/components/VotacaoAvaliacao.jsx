import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { ArrowLeft, Star, Clock, Users, ChefHat, Send } from 'lucide-react'

const VotacaoAvaliacao = ({ dadosJurado, pratoSelecionado, onNext, onBack }) => {
  const [avaliacao, setAvaliacao] = useState({
    limpeza: 0,
    ambiente: 0,
    atendimento: 0,
    qualidadeGeral: 0,
    receitaParticipante: 0,
    observacoes: ''
  })

  const [hoveredCriteria, setHoveredCriteria] = useState(null)
  const [hoveredStar, setHoveredStar] = useState(null)

  const criterios = [
    {
      key: 'limpeza',
      nome: 'Limpeza',
      descricao: 'Higiene do ambiente, utensílios e apresentação geral',
      icon: '🧽',
      color: 'blue'
    },
    {
      key: 'ambiente',
      nome: 'Ambiente',
      descricao: 'Decoração, conforto e atmosfera do estabelecimento',
      icon: '🏪',
      color: 'green'
    },
    {
      key: 'atendimento',
      nome: 'Atendimento',
      descricao: 'Cordialidade, agilidade e qualidade do serviço',
      icon: '👥',
      color: 'purple'
    },
    {
      key: 'qualidadeGeral',
      nome: 'Qualidade Geral do Bufê',
      descricao: 'Variedade, frescor e qualidade dos pratos oferecidos',
      icon: '🍽️',
      color: 'orange'
    },
    {
      key: 'receitaParticipante',
      nome: 'Receita Participante',
      descricao: 'Sabor, apresentação e originalidade do prato concorrente',
      icon: '⭐',
      color: 'red'
    }
  ]

  const handleStarClick = (criterio, nota) => {
    setAvaliacao(prev => ({
      ...prev,
      [criterio]: nota
    }))
  }

  const handleSubmit = () => {
    // Verificar se todos os critérios foram avaliados
    const criteriosPreenchidos = criterios.every(criterio => avaliacao[criterio.key] > 0)
    
    if (!criteriosPreenchidos) {
      alert('Por favor, avalie todos os critérios antes de continuar.')
      return
    }

    // Calcular média
    const soma = criterios.reduce((acc, criterio) => acc + avaliacao[criterio.key], 0)
    const media = (soma / criterios.length).toFixed(1)

    const avaliacaoCompleta = {
      ...avaliacao,
      prato: pratoSelecionado,
      jurado: dadosJurado,
      media: parseFloat(media),
      dataAvaliacao: new Date().toISOString()
    }

    // Salvar no localStorage
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]')
    avaliacoes.push(avaliacaoCompleta)
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes))

    onNext(avaliacaoCompleta)
  }

  const renderStars = (criterio) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= avaliacao[criterio.key]
          const isHovered = hoveredCriteria === criterio.key && star <= hoveredStar
          
          return (
            <button
              key={star}
              type="button"
              className={`w-8 h-8 transition-all duration-200 ${
                isActive || isHovered
                  ? 'text-yellow-400 scale-110'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
              onClick={() => handleStarClick(criterio.key, star)}
              onMouseEnter={() => {
                setHoveredCriteria(criterio.key)
                setHoveredStar(star)
              }}
              onMouseLeave={() => {
                setHoveredCriteria(null)
                setHoveredStar(null)
              }}
            >
              <Star className="w-full h-full fill-current" />
            </button>
          )
        })}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {avaliacao[criterio.key] > 0 ? `${avaliacao[criterio.key]}/5` : 'Não avaliado'}
        </span>
      </div>
    )
  }

  const getMediaColor = () => {
    const soma = criterios.reduce((acc, criterio) => acc + avaliacao[criterio.key], 0)
    const media = soma / criterios.length
    
    if (media >= 4.5) return 'text-green-600'
    if (media >= 3.5) return 'text-yellow-600'
    if (media >= 2.5) return 'text-orange-600'
    return 'text-red-600'
  }

  const calcularMedia = () => {
    const soma = criterios.reduce((acc, criterio) => acc + avaliacao[criterio.key], 0)
    const criteriosAvaliados = criterios.filter(criterio => avaliacao[criterio.key] > 0).length
    
    if (criteriosAvaliados === 0) return 0
    return (soma / criterios.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Avaliação do Prato</h1>
                <p className="text-sm text-gray-600">
                  Jurado: <span className="font-medium">{dadosJurado?.nome}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Média Atual</div>
              <div className={`text-2xl font-bold ${getMediaColor()}`}>
                {calcularMedia()}/5
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Informações do Prato */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl text-gray-800 mb-2">
                  {pratoSelecionado?.nome}
                </CardTitle>
                <p className="text-lg font-medium text-orange-600 mb-3">
                  {pratoSelecionado?.restaurante}
                </p>
                <p className="text-gray-600 mb-4">
                  {pratoSelecionado?.descricao}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {pratoSelecionado?.tempo}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {pratoSelecionado?.porcoes}
                  </span>
                  <Badge variant="outline">
                    {pratoSelecionado?.categoria}
                  </Badge>
                </div>
              </div>
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={pratoSelecionado?.imagem} 
                    alt={pratoSelecionado?.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center"><svg class="w-16 h-16 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8.1 13.34l2.83-2.83L12.93 12l2.83-2.83a1 1 0 0 1 1.41 1.41L15.34 12l1.83 1.83a1 1 0 0 1-1.41 1.41L12.93 13.41l-1.83 1.83a1 1 0 0 1-1.41-1.41L11.52 12 9.69 10.17a1 1 0 0 1 1.41-1.41L12.93 10.59l1.83-1.83z"/></svg></div>'
                    }}
                  />
                </div>
            </div>
          </CardHeader>
        </Card>

        {/* Critérios de Avaliação */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Critérios de Avaliação
            </CardTitle>
            <p className="text-sm text-gray-600">
              Avalie cada critério de 1 a 5 estrelas
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {criterios.map((criterio) => (
              <div key={criterio.key} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span className="text-xl">{criterio.icon}</span>
                      {criterio.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {criterio.descricao}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {renderStars(criterio)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Observações Adicionais
            </CardTitle>
            <p className="text-sm text-gray-600">
              Comentários opcionais sobre a experiência (opcional)
            </p>
          </CardHeader>
          
          <CardContent>
            <Textarea
              placeholder="Digite suas observações sobre o prato, ambiente, atendimento ou qualquer aspecto relevante..."
              value={avaliacao.observacoes}
              onChange={(e) => setAvaliacao(prev => ({ ...prev, observacoes: e.target.value }))}
              className="min-h-[120px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Botão de Enviar */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            size="lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar Avaliação
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VotacaoAvaliacao
