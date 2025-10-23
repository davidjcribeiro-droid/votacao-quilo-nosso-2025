import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Upload, 
  Save, 
  Search, 
  FileText,
  Download,
  Trash2,
  Eye,
  File,
  Plus
} from 'lucide-react'
import adminDataService from '../../services/AdminDataService.js'

const ReceitasManager = ({ onDataChange }) => {
  const [pratos, setPratos] = useState([])
  const [receitas, setReceitas] = useState({})
  const [filteredPratos, setFilteredPratos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPrato, setSelectedPrato] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    pdfFile: null,
    pdfName: '',
    pdfSize: 0,
    uploadDate: null
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterPratos()
  }, [pratos, searchTerm])

  const loadData = () => {
    try {
      const pratosData = adminDataService.getPratos()
      const receitasData = adminDataService.getReceitas()
      setPratos(pratosData)
      setReceitas(receitasData)
    } catch (error) {
      setError('Erro ao carregar dados')
      console.error(error)
    }
  }

  const filterPratos = () => {
    let filtered = pratos

    if (searchTerm) {
      filtered = filtered.filter(prato =>
        prato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prato.restaurante.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPratos(filtered)
  }

  const resetForm = () => {
    setFormData({
      pdfFile: null,
      pdfName: '',
      pdfSize: 0,
      uploadDate: null
    })
    setError('')
    setSuccess('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openModal = (prato) => {
    setSelectedPrato(prato)
    const receitaExistente = receitas[prato.id]
    if (receitaExistente) {
      setFormData(receitaExistente)
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPrato(null)
    resetForm()
  }

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar tipo de arquivo
    if (file.type !== 'application/pdf') {
      setError('Por favor, selecione apenas arquivos PDF')
      return
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('O arquivo PDF deve ter no máximo 10MB')
      return
    }

    try {
      const base64 = await adminDataService.pdfToBase64(file)
      setFormData({
        pdfFile: base64,
        pdfName: file.name,
        pdfSize: file.size,
        uploadDate: new Date().toISOString()
      })
      setError('')
    } catch (error) {
      setError('Erro ao processar arquivo PDF')
      console.error(error)
    }
  }

  const downloadPdf = (receita, pratoNome) => {
    if (!receita.pdfFile) return
    
    const link = document.createElement('a')
    link.href = receita.pdfFile
    link.download = receita.pdfName || `receita-${pratoNome.toLowerCase().replace(/\\s+/g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validar dados
      if (!formData.pdfFile) {
        throw new Error('Por favor, selecione um arquivo PDF da receita')
      }

      // Salvar receita
      await adminDataService.saveReceita(selectedPrato.id, formData)
      setSuccess('Receita salva com sucesso!')
      
      loadData()
      onDataChange?.()
      
      setTimeout(() => {
        closeModal()
      }, 1500)
      
    } catch (error) {
      setError(error.message || 'Erro ao salvar receita')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pratoId) => {
    if (!confirm('Tem certeza que deseja remover esta receita?')) return

    try {
      await adminDataService.deleteReceita(pratoId)
      setSuccess('Receita removida com sucesso!')
      loadData()
      onDataChange?.()
    } catch (error) {
      setError('Erro ao remover receita')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Receitas</h2>
        <div className="text-sm text-gray-600">
          {Object.keys(receitas).length} receitas cadastradas
        </div>
      </div>

      {/* Barra de busca */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome do prato ou restaurante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Grid de pratos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPratos.map((prato) => {
          const receita = receitas[prato.id]
          const temReceita = !!receita

          return (
            <Card key={prato.id} className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant={temReceita ? "default" : "secondary"}>
                  {temReceita ? "Com Receita" : "Sem Receita"}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <img 
                  src={prato.imagem} 
                  alt={prato.nome}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                  style={{ aspectRatio: '16/9' }}
                />
                <CardTitle className="text-lg pr-20">{prato.nome}</CardTitle>
                <p className="text-sm text-gray-600">{prato.restaurante}</p>
              </CardHeader>

              <CardContent className="pt-0">
                {temReceita ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <File className="h-4 w-4" />
                      <span>{receita.pdfName}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Tamanho: {formatFileSize(receita.pdfSize)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Upload: {new Date(receita.uploadDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPdf(receita, prato.nome)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(prato)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(prato.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => openModal(prato)}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Receita
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPratos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum prato encontrado</p>
        </div>
      )}

      {/* Modal de receita */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {receitas[selectedPrato?.id] ? 'Editar' : 'Adicionar'} Receita - {selectedPrato?.nome}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {/* Upload de PDF */}
            <div className="space-y-4">
              <Label htmlFor="pdf-upload">Arquivo PDF da Receita</Label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                
                {formData.pdfFile ? (
                  <div className="space-y-3">
                    <File className="h-12 w-12 text-red-600 mx-auto" />
                    <div>
                      <p className="font-medium">{formData.pdfName}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(formData.pdfSize)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar PDF
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="font-medium">Clique para fazer upload do PDF</p>
                      <p className="text-sm text-gray-600">
                        Máximo 10MB • Apenas arquivos PDF
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar PDF
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-3">
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
                disabled={loading || !formData.pdfFile}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Receita'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReceitasManager
