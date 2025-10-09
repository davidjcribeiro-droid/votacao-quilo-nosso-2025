import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ChefHat, Clock, Users, ArrowLeft, ArrowRight } from 'lucide-react'

const SelecaoPratos = ({ dadosJurado, onNext, onBack }) => {
  const [pratoSelecionado, setPratoSelecionado] = useState(null)

  // Dados dos pratos com imagens reais
  const pratos = [
    {
      id: 1,
      nome: "Frango Assado com Batatas",
      restaurante: "Casa da Feijoada",
      categoria: "Prato Principal",
      tempo: "45 min",
      porcoes: "4-6 pessoas",
      descricao: "Frango assado dourado com batatas e cebolas caramelizadas, temperado com ervas finas",
      imagem: "/images/pratos/carne-de-frango-assado-com-batatas-e-cebolas.jpg",
      status: "Pendente"
    },
    {
      id: 2,
      nome: "Café da Manhã Inglês Completo",
      restaurante: "Sabores Internacionais",
      categoria: "Café da Manhã", 
      tempo: "30 min",
      porcoes: "1-2 pessoas",
      descricao: "Café da manhã tradicional inglês com ovos, bacon, linguiça, feijão e cogumelos",
      imagem: "/images/pratos/prato-de-pequeno-almoco-ingles.jpg",
      status: "Pendente"
    },
    {
      id: 3,
      nome: "Salada Caesar com Camarão",
      restaurante: "Tempero da Bahia",
      categoria: "Salada",
      tempo: "20 min", 
      porcoes: "2-3 pessoas",
      descricao: "Salada caesar clássica com camarões grelhados, parmesão e croutons artesanais",
      imagem: "/images/pratos/camarao-caesar-salada-vista-superior.jpg",
      status: "Avaliado"
    },
    {
      id: 4,
      nome: "Sopa Oriental de Ervilha",
      restaurante: "Pantanal Gourmet",
      categoria: "Sopa",
      tempo: "35 min",
      porcoes: "3-4 pessoas", 
      descricao: "Sopa oriental cremosa de ervilha com carne e vegetais frescos da estação",
      imagem: "/images/pratos/sopa-de-ervilha-oriental-deliciosa-antropofaga-com-carne-em-uma-tabela-de-madeira-vista-de-alto-angulo.jpg",
      status: "Pendente"
    },
    {
      id: 5,
      nome: "Penne com Molho de Tomate",
      restaurante: "Cozinha do Sertão",
      categoria: "Massa",
      tempo: "25 min",
      porcoes: "2-3 pessoas",
      descricao: "Macarrão penne al dente com molho de tomate artesanal, carne e queijo parmesão",
      imagem: "/images/pratos/macarrao-penne-com-molho-de-tomate-carne-e-queijo-ralado.jpg", 
      status: "Pendente"
    },
    {
      id: 6,
      nome: "Salada Caesar Gourmet",
      restaurante: "Amazônia Autêntica",
      categoria: "Salada",
      tempo: "15 min",
      porcoes: "2 pessoas",
      descricao: "Salada caesar premium com frango grelhado, tomates frescos e molho especial",
      imagem: "/images/pratos/salada-caesar-com-tomate-e-pano-em-prato-triangular.jpg",
      status: "Pendente"
    }
  ]

  const handlePratoSelect = (prato) => {
    setPratoSelecionado(prato)
  }

  const handleContinuar = () => {
    if (pratoSelecionado) {
      onNext(pratoSelecionado)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Avaliado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Pendente':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const pratosPendentes = pratos.filter(prato => prato.status === 'Pendente')
  const pratosAvaliados = pratos.filter(prato => prato.status === 'Avaliado')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
                <h1 className="text-2xl font-bold text-gray-800">Seleção de Pratos</h1>
                <p className="text-sm text-gray-600">
                  Jurado: <span className="font-medium">{dadosJurado?.nome}</span> • 
                  Categoria: <span className="font-medium">{dadosJurado?.categoria}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progresso da Avaliação</div>
              <div className="text-lg font-semibold text-orange-600">
                {pratosAvaliados.length} de {pratos.length} avaliados
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{pratos.length}</div>
                  <div className="text-sm text-gray-600">Total de Pratos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{pratosPendentes.length}</div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{pratosAvaliados.length}</div>
                  <div className="text-sm text-gray-600">Avaliados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pratos */}
        <div className="space-y-6">
          {/* Pratos Pendentes */}
          {pratosPendentes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Pratos Pendentes de Avaliação
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pratosPendentes.map((prato) => (
                  <Card
                    key={prato.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg bg-white/90 backdrop-blur-sm ${
                      pratoSelecionado?.id === prato.id
                        ? 'ring-2 ring-orange-500 shadow-lg transform scale-[1.02]'
                        : 'hover:transform hover:scale-[1.01]'
                    }`}
                    onClick={() => handlePratoSelect(prato)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-800 mb-1">
                            {prato.nome}
                          </CardTitle>
                          <p className="text-sm font-medium text-orange-600 mb-2">
                            {prato.restaurante}
                          </p>
                        </div>
                        <Badge className={getStatusColor(prato.status)}>
                          {prato.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Imagem do Prato */}
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={prato.imagem} 
                            alt={prato.nome}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMzUgOTVIMTY1VjEwNUgxMzVWOTVaIiBmaWxsPSIjNkI3MjgwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjEyIj5JbWFnZW0gZG8gUHJhdG88L3RleHQ+Cjwvc3ZnPgo='
                            }}
                          />
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {prato.descricao}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {prato.tempo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {prato.porcoes}
                          </span>
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
                          {prato.categoria}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pratos Avaliados */}
          {pratosAvaliados.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-green-500" />
                Pratos Já Avaliados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pratosAvaliados.map((prato) => (
                  <Card
                    key={prato.id}
                    className="bg-white/60 backdrop-blur-sm opacity-75"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-600 mb-1">
                            {prato.nome}
                          </CardTitle>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            {prato.restaurante}
                          </p>
                        </div>
                        <Badge className={getStatusColor(prato.status)}>
                          {prato.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Imagem do Prato */}
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden opacity-75">
                          <img 
                            src={prato.imagem} 
                            alt={prato.nome}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMzUgOTVIMTY1VjEwNUgxMzVWOTVaIiBmaWxsPSIjNkI3MjgwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjEyIj5JbWFnZW0gZG8gUHJhdG88L3RleHQ+Cjwvc3ZnPgo='
                            }}
                          />
                        </div>
                        
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {prato.descricao}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {prato.tempo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {prato.porcoes}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botão de Continuar */}
        {pratoSelecionado && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={handleContinuar}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Avaliar Prato
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SelecaoPratos
