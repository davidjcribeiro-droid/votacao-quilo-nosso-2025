import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Search,
  Users,
  Mail,
  Award,
  UserCheck,
  UserX,
  Calendar,
  BarChart3
} from 'lucide-react'
import adminDataService from '../../services/AdminDataService.js'

const JuradosManager = ({ onDataChange }) => {
  const [jurados, setJurados] = useState([])
  const [filteredJurados, setFilteredJurados] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJurado, setEditingJurado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    especialidade: '',
    biografia: '',
    telefone: '',
    ativo: true
  })

  useEffect(() => {
    loadJurados()
  }, [])

  useEffect(() => {
    filterJurados()
  }, [jurados, searchTerm])

  const loadJurados = async () => {
    try {
      const juradosData = await adminDataService.getJurados()
      setJurados(juradosData)
    } catch (error) {
      setError('Erro ao carregar jurados')
      console.error(error)
    }
  }

  const filterJurados = () => {
    let filtered = jurados

    if (searchTerm) {
      filtered = filtered.filter(jurado =>
        jurado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jurado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jurado.especialidade?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredJurados(filtered)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      especialidade: '',
      biografia: '',
      telefone: '',
      ativo: true
    })
    setEditingJurado(null)
    setError('')
    setSuccess('')
  }

  const openModal = (jurado = null) => {
    if (jurado) {
      setFormData({ ...jurado })
      setEditingJurado(jurado)
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validar dados obrigatórios
      if (!formData.nome || !formData.email || !formData.especialidade) {
        throw new Error('Nome, email e especialidade são obrigatórios')
      }

      // Verificar email duplicado
      const existingJurados = await adminDataService.getJurados()
      const emailExists = existingJurados.some(j => 
        j.email === formData.email && 
        (!editingJurado || j.id !== editingJurado.id)
      )

      if (emailExists) {
        throw new Error('Este email já está sendo usado por outro jurado')
      }

      if (editingJurado) {
        // Atualizar jurado existente
        await adminDataService.updateJurado(editingJurado.id, formData)
        setSuccess('Jurado atualizado com sucesso!')
      } else {
        // Criar novo jurado
        await adminDataService.addJurado(formData)
        setSuccess('Jurado adicionado com sucesso!')
      }

      loadJurados()
      onDataChange?.()
      
      setTimeout(() => {
        closeModal()
      }, 1500)

    } catch (error) {
      setError(error.message || 'Erro ao salvar jurado')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jurado) => {
    if (!window.confirm(`Tem certeza que deseja excluir o jurado "${jurado.nome}"?\n\nAtenção: As votações já realizadas por este jurado serão preservadas.`)) {
      return
    }

    try {
      await adminDataService.deleteJurado(jurado.id)
      loadJurados()
      onDataChange?.()
      setSuccess('Jurado excluído com sucesso!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Erro ao excluir jurado')
      setTimeout(() => setError(''), 3000)
    }
  }

  const toggleJuradoStatus = async (jurado) => {
    try {
      await adminDataService.updateJurado(jurado.id, {
        ...jurado,
        ativo: !jurado.ativo
      })
      loadJurados()
      onDataChange?.()
    } catch (error) {
      setError('Erro ao atualizar status do jurado')
      setTimeout(() => setError(''), 3000)
    }
  }

  const getVotingStats = (juradoId) => {
    // Simular estatísticas de votação
    // Em uma implementação real, isso viria do sistema de votações
    const totalPratos = adminDataService.getPratos().length
    const votedPratos = Math.floor(Math.random() * totalPratos)
    return {
      total: totalPratos,
      voted: votedPratos,
      percentage: totalPratos > 0 ? Math.round((votedPratos / totalPratos) * 100) : 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Jurados</h2>
        <Button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Jurado
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Jurados Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJurados.map(jurado => {
          const stats = getVotingStats(jurado.id)
          return (
            <Card key={jurado.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${!jurado.ativo ? 'opacity-75' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{jurado.nome}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{jurado.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={jurado.ativo ? "default" : "secondary"}>
                      {jurado.ativo ? (
                        <>
                          <UserCheck className="h-3 w-3 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Inativo
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Especialidade */}
                {jurado.especialidade && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-600">
                      {jurado.especialidade}
                    </span>
                  </div>
                )}

                {/* Biografia */}
                {jurado.biografia && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {jurado.biografia}
                  </p>
                )}

                {/* Estatísticas de Votação */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Progresso de Votação</span>
                    <span className="text-xs text-gray-600">{stats.voted}/{stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">{stats.percentage}% completo</span>
                    <BarChart3 className="h-3 w-3 text-gray-400" />
                  </div>
                </div>

                {/* Data de Cadastro */}
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Cadastrado em {new Date(jurado.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(jurado)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleJuradoStatus(jurado)}
                    className={jurado.ativo ? "text-orange-600 border-orange-200 hover:bg-orange-50" : "text-green-600 border-green-200 hover:bg-green-50"}
                  >
                    {jurado.ativo ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(jurado)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredJurados.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum jurado encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Tente ajustar o termo de busca'
                : 'Comece adicionando seu primeiro jurado'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => openModal()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Jurado
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Adicionar/Editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJurado ? 'Editar Jurado' : 'Adicionar Novo Jurado'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informações Básicas */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Ana Paula Silva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Ex: ana.paula@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Input
                id="especialidade"
                value={formData.especialidade}
                onChange={(e) => handleInputChange('especialidade', e.target.value)}
                placeholder="Ex: Culinária Regional, Gastronomia Internacional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="Ex: (11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biografia">Biografia</Label>
              <Textarea
                id="biografia"
                value={formData.biografia}
                onChange={(e) => handleInputChange('biografia', e.target.value)}
                placeholder="Breve descrição sobre a experiência e especialidades do jurado..."
                rows={3}
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => handleInputChange('ativo', checked)}
              />
              <Label htmlFor="ativo">Jurado ativo</Label>
            </div>

            {/* Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Salvando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{editingJurado ? 'Atualizar' : 'Adicionar'}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default JuradosManager
