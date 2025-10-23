import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const supabaseUrl = 'https://hnrjbpjzjgqhgzjnhqpz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucmpicGp6amdxaGd6am5ocXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MDI0MzcsImV4cCI6MjA0NTI3ODQzN30.tnJGEtJM2nKJGWJl2-lXgKSLB1W8Ywn4vF8Ow2Yd1Qs'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Função para testar conexão
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('pratos').select('count').limit(1)
    if (error) {
      console.error('Erro na conexão:', error)
      return false
    }
    console.log('✅ Conexão com Supabase estabelecida')
    return true
  } catch (error) {
    console.error('❌ Falha na conexão com Supabase:', error)
    return false
  }
}
