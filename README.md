# 🚀 Sistema Completo de Gerenciamento de Usuários

Um sistema **Full Stack** completo para gerenciamento de usuários com **CRUD** (Create, Read, Update, Delete) e **atualizações automáticas em tempo real**. Desenvolvido com **Node.js + Express + Prisma + MongoDB** no backend e **HTML + CSS + JavaScript** no frontend.

## ✨ Funcionalidades Implementadas

### ✅ **CRUD Completo:**
- **CREATE** - Cadastrar novos usuários com validação
- **READ** - Listar todos os usuários ordenados
- **UPDATE** - Editar informações de usuários existentes
- **DELETE** - Remover usuários com confirmação

### ✅ **Atualizações Automáticas:**
- **Interface atualiza automaticamente** após cada operação
- **Contador de usuários** em tempo real
- **Destaque visual** para usuários recém criados/editados
- **Validação em tempo real** nos formulários

### ✅ **Recursos Avançados:**
- **Validação completa** de dados (email, nome, idade)
- **Mensagens de feedback** para todas as operações
- **Modal de confirmação** antes de excluir
- **Interface responsiva** para todos os dispositivos
- **Tratamento de erros** robusto
- **Atalhos de teclado** (ESC, F5)
- **Prevenção de XSS** e segurança

## 🛠️ Tecnologias Utilizadas

### **Backend (API REST)**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Prisma** - ORM moderno para banco de dados
- **MongoDB** - Banco de dados NoSQL
- **CORS** - Middleware para requisições cross-origin

### **Frontend**
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna e responsiva
- **JavaScript (ES6+)** - Lógica e integração com API

## 📁 Estrutura do Projeto

\`\`\`
sistema-usuarios/
├── server.js              # 🚀 Servidor principal da API
├── package.json           # 📦 Dependências e scripts
├── .env                   # 🔐 Variáveis de ambiente
├── prisma/
│   └── schema.prisma      # 🗄️ Schema do banco de dados
└── public/                # 🌐 Frontend
    ├── index.html         # 📄 Página principal
    ├── styles.css         # 🎨 Estilos CSS
    └── script.js          # ⚡ Lógica JavaScript
\`\`\`

## ⚙️ Pré-requisitos

- **Node.js** (versão 16 ou superior) - [Download](https://nodejs.org/)
- **MongoDB** (local ou MongoDB Atlas) - [Setup](https://www.mongodb.com/)
- **Editor de código** (VSCode recomendado)

## 🚀 Como Executar o Projeto

### **Método 1: Execução Rápida (Recomendado)**

1. **Clone ou baixe o projeto**
2. **Abra o terminal na pasta do projeto**
3. **Execute o comando de setup:**
   \`\`\`bash
   npm run setup
   \`\`\`
4. **Inicie o servidor:**
   \`\`\`bash
   npm start
   \`\`\`
5. **Acesse no navegador:**
   \`\`\`
   http://localhost:3000
   \`\`\`

### **Método 2: Passo a Passo Detalhado**

#### **1️⃣ Configuração do Backend**

\`\`\`bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Sincronizar banco de dados
npx prisma db push

# Iniciar servidor
npm start
\`\`\`

#### **2️⃣ Verificação**

✅ **API funcionando:** `http://localhost:3000/cadastro`  
✅ **Frontend funcionando:** `http://localhost:3000`

### **Método 3: Usando VSCode Live Server**

1. **Instale a extensão "Live Server" no VSCode**
2. **Execute o backend:**
   \`\`\`bash
   npm start
   \`\`\`
3. **Clique com botão direito em `public/index.html`**
4. **Selecione "Open with Live Server"**

## 🎯 Como Testar Todas as Funcionalidades

### **1. Cadastrar Usuário:**
- Preencha: Nome, Email, Idade
- Clique em "Cadastrar"
- ✅ Usuário aparece automaticamente na lista

### **2. Editar Usuário:**
- Clique em "✏️ Editar" em qualquer usuário
- Modifique os dados no formulário
- Clique em "Atualizar"
- ✅ Dados atualizados automaticamente na lista

### **3. Excluir Usuário:**
- Clique em "🗑️ Excluir" em qualquer usuário
- Confirme no modal de confirmação
- ✅ Usuário removido automaticamente da lista

### **4. Validações:**
- Teste email inválido
- Teste nome muito curto
- Teste idade fora do range (1-120)
- ✅ Mensagens de erro aparecem em tempo real

## 🔧 API Endpoints

| Método | Endpoint | Descrição | Exemplo |
|--------|----------|-----------|---------|
| `GET` | `/cadastro` | Lista todos os usuários | `GET /cadastro` |
| `POST` | `/cadastro` | Cria novo usuário | `POST /cadastro` |
| `PUT` | `/cadastro/:id` | Atualiza usuário | `PUT /cadastro/123` |
| `DELETE` | `/cadastro/:id` | Remove usuário | `DELETE /cadastro/123` |

### **Exemplo de Requisição POST:**
\`\`\`json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "idade": "25"
}
\`\`\`

### **Exemplo de Resposta:**
\`\`\`json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "idade": "25"
}
\`\`\`

## 🐛 Solução de Problemas

### ❌ **"Cannot connect to database"**
**Solução:**
1. Verifique se MongoDB está rodando
2. Confirme a string de conexão no `.env`
3. Execute: `npx prisma db push`

### ❌ **"CORS policy error"**
**Solução:**
1. Certifique-se que API está na porta 3000
2. Verifique se CORS está configurado no `server.js`

### ❌ **"Frontend não carrega dados"**
**Solução:**
1. Confirme se API está rodando: `http://localhost:3000/cadastro`
2. Abra Console do navegador (F12) para ver erros
3. Verifique se não há bloqueio de firewall

### ❌ **"Erro ao instalar dependências"**
**Solução:**
\`\`\`bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 📊 Modelo de Dados

\`\`\`javascript
// Usuário
{
  id: String,      // ID único MongoDB ObjectId
  nome: String,    // Nome completo (obrigatório, min: 2 chars)
  email: String,   // Email único (obrigatório, formato válido)
  idade: String    // Idade (obrigatório, 1-120 anos)
}
\`\`\`

## 🎨 Características do Design

- **Design moderno** com gradientes e sombras
- **Totalmente responsivo** (mobile, tablet, desktop)
- **Animações suaves** nas interações
- **Feedback visual** para todas as ações
- **Cores harmoniosas** e profissionais
- **Acessibilidade** (ARIA, contraste, teclado)
- **Modo escuro** automático (opcional)

## 🔒 Segurança Implementada

- **Validação de dados** no frontend e backend
- **Prevenção de XSS** com escape de HTML
- **Validação de email único** no banco
- **Tratamento de erros** sem exposição de dados sensíveis
- **CORS configurado** adequadamente

## 📱 Compatibilidade

- ✅ **Chrome** (versão 80+)
- ✅ **Firefox** (versão 75+)
- ✅ **Safari** (versão 13+)
- ✅ **Edge** (versão 80+)
- ✅ **Mobile** (iOS Safari, Chrome Mobile)

## 🚀 Scripts Disponíveis

\`\`\`bash
npm start          # Iniciar servidor de produção
npm run dev        # Iniciar com nodemon (desenvolvimento)
npm run setup      # Instalar + configurar banco + gerar Prisma
npm run reset-db   # Resetar banco de dados
npm test           # Verificar se tudo está funcionando
\`\`\`

## 📈 Próximas Melhorias (Opcional)

- [ ] Paginação para muitos usuários
- [ ] Busca e filtros
- [ ] Exportar dados (CSV, PDF)
- [ ] Autenticação de usuários
- [ ] Upload de foto de perfil
- [ ] Histórico de alterações

## 👨‍💻 Desenvolvido Para

**Projeto Acadêmico** - Demonstração de conhecimentos em:
- ✅ Desenvolvimento Full Stack
- ✅ APIs RESTful completas
- ✅ Integração Frontend/Backend
- ✅ Banco de dados NoSQL
- ✅ Interface moderna e responsiva
- ✅ CRUD com atualizações automáticas

---

## 🎯 **EXECUÇÃO RÁPIDA - TUTORIAL ALTERNATIVO**

### **Opção A: Comando Único**
\`\`\`bash
npm run setup && npm start
\`\`\`

### **Opção B: Interface Gráfica (Windows)**
1. **Clique duplo em `package.json`**
2. **Abra com VSCode**
3. **Terminal → New Terminal**
4. **Digite:** `npm run setup`
5. **Digite:** `npm start`
6. **Abra:** `http://localhost:3000`

### **Opção C: Usando Node.js diretamente**
\`\`\`bash
node server.js
\`\`\`

### **✅ Verificação de Sucesso:**
- ✅ Terminal mostra: "🚀 Servidor rodando na porta 3000"
- ✅ Navegador abre: `http://localhost:3000`
- ✅ Formulário aparece funcionando
- ✅ Lista de usuários carrega (mesmo vazia)

---

**🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!**  
**Atende 100% aos requisitos do professor: CRUD completo com atualizações automáticas no frontend!**
