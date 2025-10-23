// Script para limpar completamente todos os dados do sistema
export function clearAllData() {
  try {
    console.log('🧹 Iniciando limpeza completa dos dados...')
    
    // Lista de todas as chaves do localStorage relacionadas ao sistema
    const keysToRemove = [
      'pratos',
      'jurados', 
      'avaliacoes',
      'receitas',
      'admin_authenticated',
      'last_api_sync'
    ]
    
    // Remover chaves específicas
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log(`✅ Removido: ${key}`)
    })
    
    // Remover todas as chaves de votações de jurados
    const allKeys = Object.keys(localStorage)
    const votacaoKeys = allKeys.filter(key => key.startsWith('votacoes_jurado_'))
    
    votacaoKeys.forEach(key => {
      localStorage.removeItem(key)
      console.log(`✅ Removido: ${key}`)
    })
    
    // Limpar qualquer cache do navegador relacionado
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    
    console.log('🎉 Limpeza completa finalizada!')
    console.log('📝 Para limpar o Supabase, acesse o painel administrativo e execute:')
    console.log('   DELETE FROM avaliacoes;')
    console.log('   DELETE FROM jurados;') 
    console.log('   DELETE FROM pratos;')
    console.log('   DELETE FROM receitas;')
    
    return {
      success: true,
      message: 'Todos os dados locais foram removidos com sucesso',
      removedKeys: [...keysToRemove, ...votacaoKeys]
    }
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error)
    return {
      success: false,
      message: 'Erro durante a limpeza dos dados',
      error: error.message
    }
  }
}

// Função para executar a limpeza via console do navegador
window.clearAllData = clearAllData

// Função para limpar Supabase automaticamente
export async function clearSupabaseData() {
  try {
    console.log('🗑️ Iniciando limpeza do Supabase...')
    
    // Fazer requisições para o backend limpar o Supabase
    const baseUrl = window.location.origin.includes('localhost') 
      ? 'http://localhost:3001'
      : 'https://oquiloenosso-backend-91acx5w4d-davids-projects-9d96ac17.vercel.app'
    
    const queries = [
      'DELETE FROM avaliacoes;',
      'DELETE FROM jurados;', 
      'DELETE FROM pratos;',
      'DELETE FROM receitas;',
      'ALTER SEQUENCE avaliacoes_id_seq RESTART WITH 1;',
      'ALTER SEQUENCE jurados_id_seq RESTART WITH 1;',
      'ALTER SEQUENCE pratos_id_seq RESTART WITH 1;',
      'ALTER SEQUENCE receitas_id_seq RESTART WITH 1;'
    ]
    
    for (const query of queries) {
      try {
        const response = await fetch(`${baseUrl}/api/execute-sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        })
        
        if (response.ok) {
          console.log(`✅ Executado: ${query}`)
        } else {
          console.warn(`⚠️ Falha: ${query}`, await response.text())
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao executar: ${query}`, error.message)
      }
    }
    
    console.log('🎉 Limpeza do Supabase concluída!')
    return { success: true, message: 'Supabase limpo com sucesso' }
    
  } catch (error) {
    console.error('❌ Erro na limpeza do Supabase:', error)
    return { success: false, message: 'Erro na limpeza do Supabase: ' + error.message }
  }
}

window.clearSupabaseData = clearSupabaseData

// Função para verificar se há dados no sistema
export function checkDataStatus() {
  const pratos = JSON.parse(localStorage.getItem('pratos') || '[]')
  const jurados = JSON.parse(localStorage.getItem('jurados') || '[]')
  const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]')
  
  const allKeys = Object.keys(localStorage)
  const votacaoKeys = allKeys.filter(key => key.startsWith('votacoes_jurado_'))
  
  console.log('📊 Status atual dos dados:')
  console.log(`   Pratos: ${pratos.length}`)
  console.log(`   Jurados: ${jurados.length}`)
  console.log(`   Avaliações: ${avaliacoes.length}`)
  console.log(`   Votações de jurados: ${votacaoKeys.length}`)
  
  return {
    pratos: pratos.length,
    jurados: jurados.length,
    avaliacoes: avaliacoes.length,
    votacoes: votacaoKeys.length,
    isEmpty: pratos.length === 0 && jurados.length === 0 && avaliacoes.length === 0 && votacaoKeys.length === 0
  }
}

window.checkDataStatus = checkDataStatus
