import { useState, useEffect } from 'react'
import IdentificacaoJurado from './components/IdentificacaoJurado.jsx'
import SelecaoPratos from './components/SelecaoPratos.jsx'
import VotacaoAvaliacao from './components/VotacaoAvaliacao.jsx'
import RankingFinal from './components/RankingFinal.jsx'
import AdminPanel from './components/admin/AdminPanel.jsx'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('identificacao')
  const [dadosJurado, setDadosJurado] = useState(null)
  const [pratoSelecionado, setPratoSelecionado] = useState(null)
  const [isAdminMode, setIsAdminMode] = useState(false)

  useEffect(() => {
    // Verificar se está no modo admin pela URL ou hash
    const urlPath = window.location.pathname
    const urlHash = window.location.hash
    if (urlPath === '/admin' || urlPath.startsWith('/admin/') || urlHash === '#admin' || urlHash.startsWith('#admin')) {
      setIsAdminMode(true)
      return
    }

    // Verificar se há dados do jurado salvos
    const dadosSalvos = localStorage.getItem('dadosJurado')
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos)
      setDadosJurado(dados)
      setCurrentScreen('selecao')
    }
  }, [])

  const handleIdentificacaoComplete = () => {
    // Os dados já foram salvos no localStorage pelo componente
    const dadosSalvos = localStorage.getItem('dadosJurado')
    if (dadosSalvos) {
      setDadosJurado(JSON.parse(dadosSalvos))
      setCurrentScreen('selecao')
    }
  }

  const handleAvaliarPrato = (prato) => {
    setPratoSelecionado(prato)
    setCurrentScreen('votacao')
  }

  const handleVerRanking = () => {
    setCurrentScreen('ranking')
  }

  const handleBackToIdentificacao = () => {
    // Limpar dados salvos
    localStorage.removeItem('dadosJurado')
    setDadosJurado(null)
    setCurrentScreen('identificacao')
  }

  const handleBackToSelecao = () => {
    setPratoSelecionado(null)
    setCurrentScreen('selecao')
  }

  const handleReset = () => {
    // Limpar todos os dados e voltar ao início
    localStorage.removeItem('dadosJurado')
    // Opcionalmente limpar votações (comentado para preservar dados)
    // localStorage.clear()
    setDadosJurado(null)
    setPratoSelecionado(null)
    setCurrentScreen('identificacao')
  }

  const renderCurrentScreen = () => {
    // Modo administrativo
    if (isAdminMode) {
      return <AdminPanel />
    }

    // Modo de votação normal
    switch (currentScreen) {
      case 'identificacao':
        return <IdentificacaoJurado onNext={handleIdentificacaoComplete} />
      
      case 'selecao':
        return (
          <SelecaoPratos 
            dadosJurado={dadosJurado}
            onNext={handleVerRanking}
            onBack={handleBackToIdentificacao}
            onAvaliarPrato={handleAvaliarPrato}
          />
        )
      
      case 'votacao':
        return (
          <VotacaoAvaliacao 
            dadosJurado={dadosJurado}
            pratoSelecionado={pratoSelecionado}
            onNext={handleBackToSelecao}
            onBack={handleBackToSelecao}
          />
        )
      
      case 'ranking':
        return (
          <RankingFinal 
            dadosJurado={dadosJurado}
            onReset={handleReset}
            onBack={handleBackToSelecao}
          />
        )
      
      default:
        return <IdentificacaoJurado onNext={handleIdentificacaoComplete} />
    }
  }

  return (
    <div className="App">
      {renderCurrentScreen()}
      
      {/* Link para admin no modo de votação */}
      {!isAdminMode && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => {
              window.location.hash = '#admin'
              setIsAdminMode(true)
            }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none"
            title="Painel Administrativo"
          >
            Admin
          </button>
        </div>
      )}
    </div>
  )
}

export default App
