import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { AlertTriangle, Trash2, RefreshCw, Database, CheckCircle } from 'lucide-react'
import { clearAllData, checkDataStatus, clearSupabaseData } from '../../utils/clearAllData.js'

const DataCleanup = () => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmStep, setConfirmStep] = useState(0)

  const handleCheckStatus = () => {
    const dataStatus = checkDataStatus()
    setStatus(dataStatus)
  }

  const handleClearData = async () => {
    if (confirmStep < 2) {
      setConfirmStep(confirmStep + 1)
      return
    }

    setLoading(true)
    try {
      // Limpar dados locais
      const localResult = clearAllData()
      
      // Limpar Supabase
      const supabaseResult = await clearSupabaseData()
      
      if (localResult.success && supabaseResult.success) {
        setStatus(checkDataStatus())
        alert('✅ Limpeza completa realizada!\n\n• Dados locais: limpos\n• Supabase: limpo\n\nSistema resetado com sucesso!')
      } else {
        const messages = []
        if (!localResult.success) messages.push('Local: ' + localResult.message)
        if (!supabaseResult.success) messages.push('Supabase: ' + supabaseResult.message)
        alert('⚠️ Limpeza parcial:\n\n' + messages.join('\n'))
      }
    } catch (error) {
      alert('❌ Erro inesperado: ' + error.message)
    } finally {
      setLoading(false)
      setConfirmStep(0)
    }
  }

  const handleClearSupabaseOnly = async () => {
    setLoading(true)
    try {
      const result = await clearSupabaseData()
      if (result.success) {
        alert('✅ Supabase limpo com sucesso!')
      } else {
        alert('❌ Erro ao limpar Supabase: ' + result.message)
      }
    } catch (error) {
      alert('❌ Erro inesperado: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getConfirmText = () => {
    switch (confirmStep) {
      case 0: return 'Limpar Todos os Dados'
      case 1: return 'Confirmar Limpeza (IRREVERSÍVEL)'
      case 2: return 'EXECUTAR LIMPEZA AGORA'
      default: return 'Limpar Todos os Dados'
    }
  }

  const getConfirmColor = () => {
    switch (confirmStep) {
      case 0: return 'bg-orange-500 hover:bg-orange-600'
      case 1: return 'bg-red-500 hover:bg-red-600'
      case 2: return 'bg-red-700 hover:bg-red-800'
      default: return 'bg-orange-500 hover:bg-orange-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Limpeza de Dados</h2>
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Zona Perigosa
        </Badge>
      </div>

      {/* Card de Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status Atual dos Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleCheckStatus}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Status dos Dados
          </Button>

          {status && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{status.pratos}</div>
                <div className="text-sm text-gray-600">Pratos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{status.jurados}</div>
                <div className="text-sm text-gray-600">Jurados</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{status.avaliacoes}</div>
                <div className="text-sm text-gray-600">Avaliações</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{status.votacoes}</div>
                <div className="text-sm text-gray-600">Votações</div>
              </div>
            </div>
          )}

          {status && status.isEmpty && (
            <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Sistema limpo - nenhum dado encontrado</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card de Limpeza */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Trash2 className="h-5 w-5" />
            Limpeza Completa do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">⚠️ ATENÇÃO - OPERAÇÃO IRREVERSÍVEL</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Esta operação irá remover TODOS os dados do sistema:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                  <li>Todos os pratos cadastrados</li>
                  <li>Todos os jurados cadastrados</li>
                  <li>Todas as avaliações realizadas</li>
                  <li>Todas as votações em andamento</li>
                  <li>Cache e dados temporários</li>
                </ul>
                <p className="text-sm text-yellow-700 mt-2 font-medium">
                  Os dados do Supabase precisarão ser limpos manualmente no painel administrativo.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleClearData}
            disabled={loading}
            className={`w-full ${getConfirmColor()} text-white`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Limpando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {getConfirmText()}
              </>
            )}
          </Button>

          {confirmStep > 0 && (
            <Button
              onClick={() => setConfirmStep(0)}
              variant="outline"
              className="w-full"
            >
              Cancelar
            </Button>
          )}

          <div className="text-xs text-gray-500 text-center">
            {confirmStep === 0 && 'Clique 3 vezes para confirmar a limpeza'}
            {confirmStep === 1 && 'Clique mais 2 vezes para confirmar'}
            {confirmStep === 2 && 'Última chance - clique para executar'}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-2">Limpeza Apenas do Supabase</h4>
            <p className="text-sm text-gray-600 mb-3">
              Limpa apenas os dados do banco Supabase, mantendo os dados locais.
            </p>
            <Button
              onClick={handleClearSupabaseOnly}
              disabled={loading}
              variant="outline"
              className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Limpando Supabase...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Limpar Apenas Supabase
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instruções para Supabase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Limpeza do Supabase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Para limpar completamente o banco de dados Supabase, execute as seguintes queries no SQL Editor:
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div>-- Limpar todas as tabelas</div>
            <div>DELETE FROM avaliacoes;</div>
            <div>DELETE FROM jurados;</div>
            <div>DELETE FROM pratos;</div>
            <div>DELETE FROM receitas;</div>
            <div className="mt-2">-- Resetar sequências (opcional)</div>
            <div>ALTER SEQUENCE avaliacoes_id_seq RESTART WITH 1;</div>
            <div>ALTER SEQUENCE jurados_id_seq RESTART WITH 1;</div>
            <div>ALTER SEQUENCE pratos_id_seq RESTART WITH 1;</div>
            <div>ALTER SEQUENCE receitas_id_seq RESTART WITH 1;</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataCleanup
