import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save, 
  X, 
  Search, 
  Filter,
  Image as ImageIcon,
  Clock,
  Users,
  MapPin,
  ChefHat
} from 'lucide-react'
import adminDataService from '../../services/AdminDataService.js'

const PratosManager = ({ onDataChange }) => {
  const [pratos, setPratos] = useState([])
  const [filteredPratos, setFilteredPratos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrato, setEditingPrato] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    nome: '',
    restaurante: '',
    descricao: '',
    tempo: '',
    porcoes: '',
    categoria: '',
    estado: '',
    chef: '',
    imagem: ''
  })

  const categorias = [
    'Prato Principal',
    'Entrada',
    'Sobremesa',
    'Salada',
    'Sopa',
    'Massa',
    'Café da Manhã',
    'Lanche',
    'Bebida'
  ]

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  useEffect(() => {
    loadPratos()
  }, [])

  useEffect(() => {
    filterPratos()
  }, [pratos, searchTerm, categoryFilter])

  const loadPratos = async () => {
    try {
      const pratosData = await adminDataService.getPratos()
      setPratos(pratosData)
    } catch (error) {
      setError('Erro ao carregar pratos')
      console.error(error)
    }
  }

  const filterPratos = () => {
    let filtered = pratos

    if (searchTerm) {
      filtered = filtered.filter(prato =>
        prato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prato.restaurante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prato.chef?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(prato => prato.categoria === categoryFilter)
    }

    setFilteredPratos(filtered)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      restaurante: '',
      descricao: '',
      tempo: '',
      porcoes: '',
      categoria: '',
      estado: '',
      chef: '',
      imagem: ''
    })
    setEditingPrato(null)
    setError('')
    setSuccess('')
  }

  const openModal = (prato = null) => {
    if (prato) {
      setFormData({ ...prato })
      setEditingPrato(prato)
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    try {
      // Converter para base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setFormData(prev => ({
        ...prev,
        imagem: base64
      }))
      setError('')
    } catch (error) {
      setError('Erro ao processar imagem')
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validar dados obrigatórios
      if (!formData.nome || !formData.restaurante || !formData.descricao) {
        throw new Error('Nome, restaurante e descrição são obrigatórios')
      }

      if (editingPrato) {
        // Atualizar prato existente
        await adminDataService.updatePrato(editingPrato.id, formData)
        setSuccess('Prato atualizado com sucesso!')
      } else {
        // Criar novo prato
        await adminDataService.addPrato(formData)
        setSuccess('Prato adicionado com sucesso!')
      }

      loadPratos()
      onDataChange?.()
      
      setTimeout(() => {
        closeModal()
      }, 1500)

    } catch (error) {
      setError(error.message || 'Erro ao salvar prato')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (prato) => {
    if (!window.confirm(`Tem certeza que deseja excluir o prato "${prato.nome}"?`)) {
      return
    }

    try {
      await adminDataService.deletePrato(prato.id)
      loadPratos()
      onDataChange?.()
      setSuccess('Prato excluído com sucesso!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Erro ao excluir prato')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Pratos</h2>
        <Button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Prato
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, restaurante ou chef..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

      {/* Pratos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPratos.map(prato => (
          <Card key={prato.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative bg-gray-100">
              {prato.imagem ? (
                <img
                  src={prato.imagem}
                  alt={prato.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}

            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">{prato.nome}</h3>
                <p className="text-sm text-orange-600 font-medium">{prato.restaurante}</p>
                
                {prato.estado && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{prato.estado}</span>
                  </div>
                )}

                {prato.chef && (
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <ChefHat className="h-3 w-3" />
                    <span>{prato.chef}</span>
                  </div>
                )}

                <p className="text-sm text-gray-600 line-clamp-2">{prato.descricao}</p>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal(prato)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(prato)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPratos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum prato encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando seu primeiro prato'
              }
            </p>
            {(!searchTerm && categoryFilter === 'all') && (
              <Button onClick={() => openModal()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Prato
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Adicionar/Editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPrato ? 'Editar Prato' : 'Adicionar Novo Prato'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload de Imagem */}
            <div className="space-y-2">
              <Label>Imagem do Prato</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {formData.imagem ? (
                  <div className="relative">
                    <img
                      src={formData.imagem}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, imagem: '' }))}
                      className="absolute top-2 right-2 bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Clique para fazer upload da imagem
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG ou WebP (máx. 5MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Prato *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: Feijoada Completa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restaurante">Restaurante *</Label>
                <Input
                  id="restaurante"
                  value={formData.restaurante}
                  onChange={(e) => handleInputChange('restaurante', e.target.value)}
                  placeholder="Ex: Casa da Feijoada"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descreva o prato, ingredientes principais e características especiais..."
                rows={3}
                required
              />
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chef">Chef/Responsável</Label>
                <Input
                  id="chef"
                  value={formData.chef}
                  onChange={(e) => handleInputChange('chef', e.target.value)}
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange('estado', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map(estado => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Salvando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{editingPrato ? 'Atualizar' : 'Adicionar'}</span>
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

export default PratosManager
