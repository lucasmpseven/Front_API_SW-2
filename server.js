const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const path = require("path");
require('dotenv').config(); // Adicione esta linha

const app = express();
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Função para testar conexão com o MongoDB
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Conectado ao MongoDB com sucesso!");

    // Testar a conexão com uma consulta simples
    const count = await prisma.usuario.count();
    console.log(`📊 Total de usuários no banco: ${count}`);

    // Criar usuários de exemplo apenas se não existirem
    if (count === 0) {
      console.log("📝 Criando usuários de exemplo...");
      
      // Criar um por um para evitar erro de duplicação
      const usuariosExemplo = [
        { nome: "João Silva", email: "joao@email.com", idade: 30 },
        { nome: "Maria Santos", email: "maria@email.com", idade: 25 },
        { nome: "Pedro Costa", email: "pedro@email.com", idade: 35 },
      ];

      for (const usuario of usuariosExemplo) {
        try {
          await prisma.usuario.create({
            data: usuario
          });
        } catch (error) {
          if (error.code !== 'P2002') { // Ignorar erro de email duplicado
            throw error;
          }
        }
      }
      console.log("✅ Usuários de exemplo criados!");
    }
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error.message);
    
    // Tentar reconectar após 5 segundos
    setTimeout(async () => {
      console.log("🔄 Tentando reconectar...");
      await testDatabaseConnection();
    }, 5000);
  }
}

// Rotas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check da API - CORRETO para MongoDB
app.get("/health", async (req, res) => {
  try {
    // Para MongoDB, use uma operação simples como count()
    await prisma.$executeRaw`SELECT 1`;
    
    res.json({ 
      status: "OK", 
      message: "✅ API e MongoDB conectados com sucesso",
      timestamp: new Date().toISOString(),
      database: "MongoDB"
    });
  } catch (error) {
    res.status(500).json({ 
      status: "ERROR", 
      message: "❌ Erro na conexão com o MongoDB",
      error: error.message,
      suggestion: "Verifique a string de conexão no arquivo .env"
    });
  }
});

// Teste de conexão com o banco
app.get("/test-db", async (req, res) => {
  try {
    const count = await prisma.usuario.count();
    const sampleUsers = await prisma.usuario.findMany({
      take: 3,
      orderBy: { nome: "asc" }
    });

    res.json({
      status: "success",
      message: "Banco conectado com sucesso",
      totalUsuarios: count,
      amostra: sampleUsers
    });
  } catch (error) {
    console.error("Erro no teste de conexão:", error);
    res.status(500).json({
      status: "error",
      message: "Erro ao conectar com o banco",
      error: error.message,
    });
  }
});

// Validar dados do usuário
function validarUsuario(dados) {
  const { nome, email, idade } = dados;
  const errors = [];

  if (!nome || nome.trim().length < 2) {
    errors.push("Nome deve ter pelo menos 2 caracteres");
  }

  if (!email) {
    errors.push("Email é obrigatório");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Email inválido");
    }
  }

  if (!idade) {
    errors.push("Idade é obrigatória");
  } else {
    const ageNum = parseInt(idade, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.push("Idade deve estar entre 1 e 120 anos");
    }
  }

  return errors;
}

// CADASTRAR usuário
app.post("/cadastro", async (req, res) => {
  try {
    console.log("📥 Recebendo dados para cadastro:", req.body);
    
    const errors = validarUsuario(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(", ") });
    }

    const { nome, email, idade } = req.body;
    const ageNum = parseInt(idade, 10);

    const usuario = await prisma.usuario.create({
      data: {
        email: email.toLowerCase().trim(),
        nome: nome.trim(),
        idade: ageNum,
      },
    });

    console.log("✅ Usuário criado com sucesso:", usuario.id);
    res.status(201).json({
      ...usuario,
      message: "Usuário cadastrado com sucesso"
    });
  } catch (error) {
    console.error("❌ Erro ao cadastrar usuário:", error);

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Este email já está cadastrado" });
    }

    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// LISTAR usuários
app.get("/cadastro", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: "asc" },
    });

    console.log(`📋 Retornando ${usuarios.length} usuários`);
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// ATUALIZAR usuário
app.put("/cadastro/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const errors = validarUsuario(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(", ") });
    }

    const { nome, email, idade } = req.body;
    const ageNum = parseInt(idade, 10);

    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        email: email.toLowerCase().trim(),
        nome: nome.trim(),
        idade: ageNum,
      },
    });

    res.json({
      ...usuario,
      message: "Usuário atualizado com sucesso"
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Este email já está sendo usado" });
    }

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// DELETAR usuário
app.delete("/cadastro/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.usuario.delete({
      where: { id },
    });

    console.log("✅ Usuário deletado com sucesso:", id);
    res.json({ 
      message: "Usuário deletado com sucesso",
      id: id
    });
  } catch (error) {
    console.error("❌ Erro ao deletar usuário:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// Rota para buscar usuário específico
app.get("/cadastro/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error("💥 Erro não tratado:", error);
  res.status(500).json({ 
    error: "Erro interno do servidor",
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Recebido sinal de desligamento...');
  await prisma.$disconnect();
  console.log('✅ Conexão com o banco fechada.');
  process.exit(0);
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;

async function startServer() {
  // Verificar se a variável de ambiente DATABASE_URL está definida
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL não definida no arquivo .env");
    console.log("📋 Exemplo de DATABASE_URL para MongoDB:");
    console.log("DATABASE_URL=\"mongodb+srv://usuario:senha@cluster.mongodb.net/nome_do_banco?retryWrites=true&w=majority\"");
    process.exit(1);
  }

  await testDatabaseConnection();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`🔧 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 Teste do banco: http://localhost:${PORT}/test-db`);
    console.log("=====================================");
  });

  return server;
}

startServer().catch(console.error);