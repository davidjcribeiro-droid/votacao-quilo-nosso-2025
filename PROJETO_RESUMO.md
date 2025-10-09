# Sistema de Votação Digital - O Quilo é Nosso 2025

## 📋 Resumo do Projeto

Interface de votação digital completa desenvolvida para o concurso "O Quilo é Nosso 2025", seguindo a identidade visual oficial do evento e implementando todas as funcionalidades solicitadas.

## 🎯 Objetivos Alcançados

### ✅ 4 Telas Principais Implementadas
1. **Identificação do Jurado** - Formulário com validação completa
2. **Seleção de Pratos** - Grid com imagens reais e informações detalhadas
3. **Votação e Avaliação** - Sistema de estrelas para 5 critérios
4. **Ranking Final** - Pódio, estatísticas e ranking completo

### ✅ Funcionalidades Técnicas
- **React + Vite** - Framework moderno e performático
- **Tailwind CSS** - Estilização responsiva e profissional
- **shadcn/ui** - Componentes UI de alta qualidade
- **Lucide Icons** - Ícones consistentes e modernos
- **LocalStorage** - Persistência de dados local

### ✅ Design e UX
- **Identidade Visual** - Cores e tipografia do site oficial
- **Responsivo** - Funciona em desktop, tablet e mobile
- **Interativo** - Hover effects, transições suaves
- **Acessível** - Feedback visual e validações claras

## 🍽️ Pratos Implementados (com Imagens Reais)

1. **Frango Assado com Batatas** - Casa da Feijoada
2. **Café da Manhã Inglês Completo** - Sabores Internacionais
3. **Salada Caesar com Camarão** - Tempero da Bahia (Avaliado)
4. **Sopa Oriental de Ervilha** - Pantanal Gourmet
5. **Penne com Molho de Tomate** - Cozinha do Sertão
6. **Salada Caesar Gourmet** - Amazônia Autêntica

## 🌟 Critérios de Avaliação

1. **🧽 Limpeza** - Higiene do ambiente, utensílios e apresentação geral
2. **🏪 Ambiente** - Decoração, conforto e atmosfera do estabelecimento
3. **👥 Atendimento** - Cordialidade, agilidade e qualidade do serviço
4. **🍽️ Qualidade Geral do Bufê** - Variedade, frescor e qualidade dos pratos
5. **⭐ Receita Participante** - Sabor, apresentação e originalidade do prato

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks (useState)
- **Data Persistence**: LocalStorage
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📁 Estrutura do Projeto

```
votacao-quilo-nosso/
├── public/
│   └── images/
│       └── pratos/          # Imagens reais dos pratos
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── IdentificacaoJurado.jsx
│   │   ├── SelecaoPratos.jsx
│   │   ├── VotacaoAvaliacao.jsx
│   │   └── RankingFinal.jsx
│   ├── App.jsx              # Roteamento principal
│   └── App.css              # Estilos globais
└── package.json
```

## 🎨 Paleta de Cores (Site Oficial)

- **Laranja Principal**: #FF6B35 (gradientes)
- **Verde Secundário**: #4CAF50 (acentos)
- **Cinza Neutro**: #6B7280 (textos)
- **Branco/Transparência**: Backgrounds com blur

## 📱 Funcionalidades por Tela

### 1. Identificação do Jurado
- Formulário com validação em tempo real
- Campos: Nome, Cidade, Categoria do Júri
- Select customizado (shadcn/ui)
- Persistência no localStorage

### 2. Seleção de Pratos
- Grid responsivo com cards interativos
- Imagens reais dos pratos em alta qualidade
- Informações completas (tempo, porções, categoria)
- Separação visual entre pendentes e avaliados
- Estatísticas de progresso

### 3. Votação e Avaliação
- Sistema de estrelas interativo (1-5)
- 5 critérios de avaliação obrigatórios
- Cálculo automático da média em tempo real
- Campo de observações opcional
- Validação antes do envio

### 4. Ranking Final
- Pódio visual dos 3 primeiros colocados
- Estatísticas gerais do evento
- Ranking completo com detalhes
- Exportação de relatório (JSON)
- Opção de nova avaliação

## 🔧 Como Executar

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

## 📊 Status do Projeto

**✅ COMPLETO E FUNCIONAL**

- [x] Todas as 4 telas implementadas
- [x] Navegação fluida entre telas
- [x] Sistema de avaliação operacional
- [x] Imagens reais integradas
- [x] Design responsivo
- [x] Validações funcionando
- [x] Persistência de dados
- [x] Identidade visual consistente

## 🎯 Próximos Passos (Opcionais)

1. **Backend Integration** - API para persistência em servidor
2. **Autenticação** - Login seguro para jurados
3. **Relatórios Avançados** - Gráficos e análises
4. **Notificações** - Alertas em tempo real
5. **Deploy** - Hospedagem em produção

---

**Desenvolvido para o concurso "O Quilo é Nosso 2025"**  
Interface de votação digital profissional e completa.
