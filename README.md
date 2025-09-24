📋 PRÉ-REQUISITOS
Node.js instalado

Conexão com internet

🔧 CONFIGURAÇÃO RÁPIDA
1️⃣ Baixe e coloque na pasta do projeto:
server.js (arquivo principal)

.env (configurações do banco)

2️⃣ Conteúdo do arquivo .env:
text
DATABASE_URL="mongodb+srv://LQynx:349260nos@primeirocluster.k08zwrc.mongodb.net/usuariosdb?retryWrites=true&w=majority&appName=PrimeiroCluster"
3️⃣ Abra o terminal na pasta do projeto e execute:
bash
npm install express @prisma/client cors dotenv
npx prisma generate
node server.js
✅ VERIFICAÇÃO
No terminal deve aparecer:
text
🚀 Servidor rodando na porta 3000
🌐 Acesse: http://localhost:3000
🌐 ACESSO
1️⃣ Interface Web:
Abra o navegador

Acesse: http://localhost:3000

2️⃣ Teste da API:
Health Check: http://localhost:3000/health

Teste do Banco: http://localhost:3000/test-db

🐛 SE DER ERRO:
Execute na ordem:
bash
# 1. Pare o servidor (Ctrl+C)
# 2. Gere o Prisma novamente
npx prisma generate

# 3. Inicie o servidor
node server.js
📞 PRONTO!
Sistema funcionando em http://localhost:3000

Apenas 3 comandos no terminal e já está rodando! 🎉
