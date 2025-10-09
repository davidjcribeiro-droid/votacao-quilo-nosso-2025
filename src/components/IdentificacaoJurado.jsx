import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { User, MapPin, Award } from 'lucide-react'

const IdentificacaoJurado = ({ onNext }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cidade: '',
    categoria: ''
  })

  const [errors, setErrors] = useState({})

  const categorias = [
    'Júri Técnico Local',
    'Júri Técnico Nacional',
    'Avaliador Convidado'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }
    
    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória'
    }
    
    if (!formData.categoria || formData.categoria === '') {
      newErrors.categoria = 'Categoria é obrigatória'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('Form submitted with data:', formData)
    console.log('Validation result:', validateForm())
    
    if (validateForm()) {
      console.log('Validation passed, calling onNext')
      // Salvar dados do jurado no localStorage ou contexto
      localStorage.setItem('dadosJurado', JSON.stringify(formData))
      onNext(formData)
    } else {
      console.log('Validation failed, errors:', errors)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="text-white text-2xl font-bold">OQN</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">O Quilo é Nosso</h1>
          <p className="text-lg text-gray-600 mb-1">Concurso 2025</p>
          <p className="text-sm text-gray-500">Sistema de Avaliação - Júri Técnico</p>
        </div>

        {/* Formulário de Identificação */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800 flex items-center justify-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Identificação do Jurado
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  Nome Completo
                </label>
                <Input
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={`transition-all duration-200 ${errors.nome ? 'border-red-500 focus:border-red-500' : 'focus:border-orange-500'}`}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
                )}
              </div>

              {/* Cidade */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  Cidade
                </label>
                <Input
                  type="text"
                  placeholder="Digite sua cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className={`transition-all duration-200 ${errors.cidade ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'}`}
                />
                {errors.cidade && (
                  <p className="text-sm text-red-500 mt-1">{errors.cidade}</p>
                )}
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  Categoria do Júri
                </label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => handleInputChange('categoria', value)}
                >
                  <SelectTrigger className={`transition-all duration-200 ${
                    errors.categoria ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                  }`}>
                    <SelectValue placeholder="Selecione sua categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria, index) => (
                      <SelectItem key={index} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoria && (
                  <p className="text-sm text-red-500 mt-1">{errors.categoria}</p>
                )}
              </div>

              {/* Botão de Continuar */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                Continuar para Avaliação
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Saudável e natural do Brasil
          </p>
        </div>
      </div>
    </div>
  )
}

export default IdentificacaoJurado
