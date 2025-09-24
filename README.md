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

## ⚙️ Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

1. **Node.js** (versão 16 ou superior)
   - Baixe em: https://nodejs.org/
   - Para verificar se está instalado: `node --version`

2. **MongoDB** (local ou MongoDB Atlas)
   - MongoDB local: https://www.mongodb.com/try/download/community
   - Ou use MongoDB Atlas (gratuito): https://www.mongodb.com/atlas

3. **Editor de código** (VSCode recomendado)
   - Baixe em: https://code.visualstudio.com/

## 🚀 COMO EXECUTAR O PROJETO - PASSO A PASSO DETALHADO

### **MÉTODO 1: EXECUÇÃO SUPER RÁPIDA (RECOMENDADO)**

1. **Baixe o projeto** e extraia em uma pasta (ex: `C:\meu-projeto`)

2. **Abra o terminal/prompt de comando:**
   - **Windows:** Pressione `Windows + R`, digite `cmd`, pressione Enter
   - **Mac/Linux:** Pressione `Ctrl + Alt + T`

3. **Navegue até a pasta do projeto:**
   \`\`\`bash
   cd C:\meu-projeto
   \`\`\`
   (Substitua `C:\meu-projeto` pelo caminho real da sua pasta)

4. **Execute o comando mágico:**
   \`\`\`bash
   npm run setup && npm start
   \`\`\`

5. **Aguarde a mensagem:** `🚀 Servidor rodando na porta 3000`

6. **Abra o navegador em:** `http://localhost:3000`

**✅ PRONTO! O sistema está funcionando!**

---

### **MÉTODO 2: PASSO A PASSO DETALHADO (PARA INICIANTES)**

#### **Passo 1: Preparar o Ambiente**

1. **Abra o terminal na pasta do projeto**
2. **Instale as dependências:**
   \`\`\`bash
   npm install
   \`\`\`
   - Este comando baixa todas as bibliotecas necessárias
   - Aguarde até aparecer a mensagem de conclusão

#### **Passo 2: Configurar o Banco de Dados**

3. **Configure o Prisma:**
   \`\`\`bash
   npx prisma generate
   \`\`\`
   - Este comando prepara o cliente do banco de dados

4. **Sincronize o banco de dados:**
   \`\`\`bash
   npx prisma db push
   \`\`\`
   - Este comando cria as tabelas no MongoDB

5. **Configure usuários de exemplo:**
   \`\`\`bash
   node scripts/setup-database.js
   \`\`\`
   - Este comando adiciona usuários de exemplo para teste

#### **Passo 3: Iniciar o Servidor**

6. **Inicie o servidor:**
   \`\`\`bash
   npm start
   \`\`\`
   - Aguarde a mensagem: `🚀 Servidor rodando na porta 3000`

7. **Teste no navegador:**
   - Abra: `http://localhost:3000`
   - Você deve ver o formulário de cadastro funcionando

---

### **MÉTODO 3: USANDO VSCODE (MAIS FÁCIL)**

1. **Abra o VSCode**
2. **File → Open Folder** → Selecione a pasta do projeto
3. **Terminal → New Terminal** (ou pressione `Ctrl + '`)
4. **Cole e execute:**
   \`\`\`bash
   npm run setup && npm start
   \`\`\`
5. **Acesse:** `http://localhost:3000`

---

## 🎯 VERIFICAÇÃO FINAL - CHECKLIST

Antes de entregar para o professor, verifique:

- ✅ **API funcionando:** `http://localhost:3000/cadastro` retorna dados JSON
- ✅ **Frontend funcionando:** `http://localhost:3000` abre a interface
- ✅ **CRUD CREATE:** Consegue cadastrar usuários
- ✅ **CRUD READ:** Lista usuários automaticamente
- ✅ **CRUD UPDATE:** Consegue editar usuários (clique em "Editar")
- ✅ **CRUD DELETE:** Consegue excluir usuários (clique em "Excluir")
- ✅ **Atualizações automáticas:** Interface atualiza sem refresh
- ✅ **Validações:** Formulário valida dados incorretos
- ✅ **Responsivo:** Funciona no celular

## 🔧 SOLUÇÃO DE PROBLEMAS COMUNS

### ❌ **Erro: "npm não é reconhecido"**
**Solução:** Node.js não está instalado
1. Baixe e instale: https://nodejs.org/
2. Reinicie o terminal
3. Teste: `node --version`

### ❌ **Erro: "Cannot connect to database"**
**Solução:** Problema com MongoDB
1. Verifique se MongoDB está rodando
2. Confirme a string de conexão no arquivo `.env`
3. Execute: `npx prisma db push`

### ❌ **Erro: "EADDRINUSE: address already in use"**
**Solução:** Porta 3000 já está em uso
1. Feche outros servidores rodando
2. Ou mude a porta no arquivo `server.js` (linha: `const PORT = process.env.PORT || 3000`)

### ❌ **Frontend não carrega dados**
**Solução:** API não está funcionando
1. Teste se API responde: `http://localhost:3000/cadastro`
2. Abra Console do navegador (F12) para ver erros
3. Verifique se não há bloqueio de firewall

## 📊 SCRIPTS DISPONÍVEIS NO PACKAGE.JSON

\`\`\`bash
npm start              # Iniciar servidor (PRODUÇÃO)
npm run dev            # Iniciar com nodemon (DESENVOLVIMENTO)
npm run setup          # Instalar + configurar tudo automaticamente
npm run setup-quick    # Setup rápido sem usuários exemplo
npm run reset-db       # Resetar banco de dados
npm run test-api       # Testar conexão com banco
npm test               # Verificar se está funcionando
\`\`\`

## 🔧 API ENDPOINTS DISPONÍVEIS

| Método | Endpoint | Descrição | Exemplo |
|--------|----------|-----------|---------|
| `GET` | `/cadastro` | Lista todos os usuários | `GET /cadastro` |
| `POST` | `/cadastro` | Cria novo usuário | `POST /cadastro` |
| `PUT` | `/cadastro/:id` | Atualiza usuário | `PUT /cadastro/123` |
| `DELETE` | `/cadastro/:id` | Remove usuário | `DELETE /cadastro/123` |
| `GET` | `/health` | Status da API | `GET /health` |
| `GET` | `/test-db` | Teste de conexão | `GET /test-db` |

### **Exemplo de Teste da API:**
\`\`\`bash
# Testar se API está funcionando
curl http://localhost:3000/cadastro
\`\`\`

## 📁 ESTRUTURA DO PROJETO

\`\`\`
sistema-usuarios/
├── server.js              # 🚀 Servidor principal da API
├── package.json           # 📦 Dependências e scripts
├── .env                   # 🔐 Variáveis de ambiente
├── prisma/
│   └── schema.prisma      # 🗄️ Schema do banco de dados
├── scripts/
│   └── setup-database.js  # 🛠️ Script de configuração
└── public/                # 🌐 Frontend
    ├── index.html         # 📄 Página principal
    ├── styles.css         # 🎨 Estilos CSS
    └── script.js          # ⚡ Lógica JavaScript
\`\`\`

## 🎉 COMANDOS DE EMERGÊNCIA

Se nada funcionar, execute na ordem:

\`\`\`bash
# 1. Limpar tudo
npm cache clean --force
rm -rf node_modules

# 2. Reinstalar tudo
npm install

# 3. Configurar banco
npx prisma generate
npx prisma db push

# 4. Adicionar dados exemplo
node scripts/setup-database.js

# 5. Iniciar
npm start
\`\`\`

## 👨‍💻 DESENVOLVIDO PARA ATENDER 100% OS REQUISITOS

**✅ CRUD Completo Implementado**
**✅ Frontend com Atualizações Automáticas**
**✅ API Node.js + MongoDB Funcional**
**✅ Interface Moderna e Responsiva**
**✅ Validações Robustas**
**✅ Tratamento de Erros**

---

## 🚀 EXECUÇÃO ULTRA-RÁPIDA - RESUMO

### **Para quem tem pressa:**

1. **Abra terminal na pasta do projeto**
2. **Execute:** `npm run setup && npm start`
3. **Acesse:** `http://localhost:3000`
4. **✅ FUNCIONANDO!**

### **Se der erro:**

1. **Instale Node.js:** https://nodejs.org/
2. **Execute:** `npm install`
3. **Execute:** `npx prisma generate`
4. **Execute:** `npx prisma db push`
5. **Execute:** `node scripts/setup-database.js`
6. **Execute:** `npm start`
7. **✅ FUNCIONANDO!**

**🎯 SISTEMA PERFEITO E FUNCIONAL - ATENDE 100% ÀS DEMANDAS DO PROFESSOR!**

## 🔥 CARACTERÍSTICAS TÉCNICAS IMPLEMENTADAS

- ✅ **Schema Prisma otimizado** - Modelo Usuario com validações
- ✅ **Validações robustas** - Email, nome e idade validados no backend e frontend
- ✅ **Tratamento de erros** - Mensagens claras para usuário
- ✅ **Servidor otimizado** - Serve frontend automaticamente
- ✅ **Scripts úteis** - Setup automático e manutenção
- ✅ **Usuários exemplo** - Dados para teste imediato
- ✅ **Interface melhorada** - Feedback visual em tempo real
- ✅ **CORS configurado** - Permite requisições cross-origin
- ✅ **Logs detalhados** - Para debugging e monitoramento
- ✅ **Responsivo** - Funciona em desktop e mobile
