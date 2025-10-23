import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Settings, 
  Users, 
  ChefHat, 
  BookOpen, 
  BarChart3, 
  Shield,
  Plus,
  Eye,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  Search,
  Filter,
  RefreshCw,
  Trophy
} from 'lucide-react'
import adminDataService from '../../services/AdminDataService.js'
import PratosManager from './PratosManager.jsx'
import JuradosManager from './JuradosManager.jsx'
import ReceitasManager from './ReceitasManager.jsx'
import RankingManager from './RankingManager.jsx'
import DataCleanup from './DataCleanup.jsx'
import AdminLogin from './AdminLogin.jsx'

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar se já está autenticado
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession) {
      const session = JSON.parse(adminSession)
      if (new Date(session.expires) > new Date()) {
        setIsAuthenticated(true)
        loadStats()
      } else {
        localStorage.removeItem('admin_session')
      }
    }
  }, [])

  const handleLogin = (password) => {
    // Senha simples para demonstração
    if (password === 'admin2025') {
      const session = {
        authenticated: true,
        expires: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 horas
      }
      localStorage.setItem('admin_session', JSON.stringify(session))
      setIsAuthenticated(true)
      loadStats()
      return true
    }
    return false
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    setIsAuthenticated(false)
    setActiveTab('dashboard')
  }

  const loadStats = () => {
    setLoading(true)
    try {
      const statistics = adminDataService.getEstatisticas()
      setStats(statistics)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    loadStats()
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-orange-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                  <p className="text-sm text-gray-500">O Quilo é Nosso 2025</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="pratos" className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4" />
              <span>Pratos</span>
            </TabsTrigger>
            <TabsTrigger value="jurados" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Jurados</span>
            </TabsTrigger>
            <TabsTrigger value="receitas" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Receitas</span>
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Ranking</span>
            </TabsTrigger>
            <TabsTrigger value="cleanup" className="flex items-center space-x-2 text-red-600">
              <Trash2 className="h-4 w-4" />
              <span>Limpeza</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Sistema Ativo
              </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Pratos</CardTitle>
                  <ChefHat className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPratos || 0}</div>
                  <p className="text-xs opacity-90">
                    {stats.pratosComReceita || 0} com receitas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jurados Ativos</CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalJurados || 0}</div>
                  <p className="text-xs opacity-90">
                    Avaliadores cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                  <BookOpen className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalReceitas || 0}</div>
                  <p className="text-xs opacity-90">
                    Receitas cadastradas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Competição</CardTitle>
                  <Settings className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2025</div>
                  <p className="text-xs opacity-90">
                    O Quilo é Nosso
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab('pratos')}
                    className="flex items-center justify-center space-x-2 h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Adicionar Prato</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveTab('jurados')}
                    className="flex items-center justify-center space-x-2 h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Users className="h-5 w-5" />
                    <span>Gerenciar Jurados</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveTab('receitas')}
                    className="flex items-center justify-center space-x-2 h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Editar Receitas</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Última atualização:</strong> {stats.ultimaAtualizacao ? new Date(stats.ultimaAtualizacao).toLocaleString('pt-BR') : 'N/A'}</p>
                  <p><strong>Versão:</strong> 1.0.0</p>
                  <p><strong>Status:</strong> <Badge variant="outline" className="text-green-600 border-green-200">Operacional</Badge></p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pratos Tab */}
          <TabsContent value="pratos">
            <PratosManager onDataChange={refreshData} />
          </TabsContent>

          {/* Jurados Tab */}
          <TabsContent value="jurados">
            <JuradosManager onDataChange={refreshData} />
          </TabsContent>

          {/* Receitas Tab */}
          <TabsContent value="receitas">
            <ReceitasManager onDataChange={refreshData} />
          </TabsContent>

          {/* Ranking Tab */}
          <TabsContent value="ranking">
            <RankingManager />
          </TabsContent>

          {/* Cleanup Tab */}
          <TabsContent value="cleanup">
            <DataCleanup />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default AdminPanel
