import { useState } from 'react'
import IdentificacaoJurado from './components/IdentificacaoJurado.jsx'
import SelecaoPratos from './components/SelecaoPratos.jsx'
import VotacaoAvaliacao from './components/VotacaoAvaliacao.jsx'
import RankingFinal from './components/RankingFinal.jsx'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('identificacao')
  const [dadosJurado, setDadosJurado] = useState(null)
  const [pratoSelecionado, setPratoSelecionado] = useState(null)

  const handleIdentificacaoComplete = (dados) => {
    setDadosJurado(dados)
    setCurrentScreen('selecao')
  }

  const handleSelecaoComplete = (prato) => {
    setPratoSelecionado(prato)
    setCurrentScreen('votacao')
  }

  const handleBackToIdentificacao = () => {
    setCurrentScreen('identificacao')
  }

  const handleBackToSelecao = () => {
    setCurrentScreen('selecao')
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'identificacao':
        return <IdentificacaoJurado onNext={handleIdentificacaoComplete} />
      case 'selecao':
        return (
          <SelecaoPratos 
            dadosJurado={dadosJurado}
            onNext={handleSelecaoComplete}
            onBack={handleBackToIdentificacao}
          />
        )
      case 'votacao':
        return (
          <VotacaoAvaliacao 
            dadosJurado={dadosJurado}
            pratoSelecionado={pratoSelecionado}
            onNext={(avaliacao) => {
              console.log('Avaliação completa:', avaliacao)
              setCurrentScreen('ranking')
            }}
            onBack={handleBackToSelecao}
          />
        )
      case 'ranking':
        return (
          <RankingFinal 
            dadosJurado={dadosJurado}
            onReset={() => {
              setCurrentScreen('identificacao')
              setDadosJurado(null)
              setPratoSelecionado(null)
            }}
          />
        )
      default:
        return <IdentificacaoJurado onNext={handleIdentificacaoComplete} />
    }
  }

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  )
}

export default App
