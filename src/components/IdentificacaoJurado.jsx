import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { User } from 'lucide-react'
import adminDataService from '../services/AdminDataService.js'

const IdentificacaoJurado = ({ onNext }) => {
  const [juradoSelecionado, setJuradoSelecionado] = useState('')
  const [errors, setErrors] = useState({})
  const [jurados, setJurados] = useState([])

  useEffect(() => {
    // Carregar jurados do AdminDataService
    const juradosCarregados = adminDataService.getJurados()
    setJurados(juradosCarregados)
  }, [])

  const handleJuradoChange = (value) => {
    setJuradoSelecionado(value)
    if (errors.jurado) {
      setErrors(prev => ({ ...prev, jurado: '' }))
    }
  }

  const isFormValid = () => {
    return juradoSelecionado.trim() !== ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}
    
    if (!juradoSelecionado.trim()) {
      newErrors.jurado = 'Por favor, selecione seu nome da lista'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Encontrar dados completos do jurado
    const juradoCompleto = jurados.find(j => j.nome === juradoSelecionado)
    
    const dadosJurado = {
      id: juradoCompleto.id,
      nome: juradoSelecionado
    }

    // Salvar no localStorage para persistência
    localStorage.setItem('dadosJurado', JSON.stringify(dadosJurado))
    
    onNext()
  }

  return (
    <div className="min-h-screen mobile-keyboard-adjust bg-gradient-to-br from-orange-50 via-green-50 to-yellow-50 mobile-safe">
      <div className="mobile-container py-4 sm:py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo e Título */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg touch-target">
              <img 
                src="/images/logo-oquiloenosso.png" 
                alt="O Quilo é Nosso" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
              <span className="text-white font-bold text-lg" style={{display: 'none'}}>OQN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">O Quilo é Nosso</h1>
            <p className="text-gray-600 mb-1 text-sm sm:text-base">Concurso 2025</p>
            <p className="text-xs sm:text-sm text-gray-500">Sistema de Avaliação - Júri Técnico</p>
          </div>

          {/* Formulário */}
          <Card className="mobile-card shadow-xl border-0">
            <CardHeader className="text-center pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center justify-center gap-2 text-gray-700 text-lg sm:text-xl">
                <User className="w-5 h-5 text-orange-600" />
                Identificação do Jurado
              </CardTitle>
            </CardHeader>
            <CardContent className="mobile-spacing space-y-4 sm:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Seleção do Jurado */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700">
                    <User className="w-4 h-4 text-orange-600" />
                    Selecione seu nome
                  </label>
                  <Select value={juradoSelecionado} onValueChange={handleJuradoChange}>
                    <SelectTrigger className={`mobile-input ${errors.jurado ? 'border-red-500' : 'border-gray-300'}`}>
                      <SelectValue placeholder="Escolha seu nome da lista" />
                    </SelectTrigger>
                    <SelectContent>
                      {jurados.map((jurado) => (
                        <SelectItem key={jurado.id} value={jurado.nome}>
                          {jurado.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jurado && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.jurado}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit"
                  disabled={!isFormValid()}
                  className={`mobile-button w-full text-white font-semibold transition-all duration-200 ${
                    isFormValid() 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Continuar para Avaliação
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default IdentificacaoJurado
