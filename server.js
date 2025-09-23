const express = require("express")
const { PrismaClient } = require("@prisma/client")
const cors = require("cors")

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(cors())
app.use(express.json())

// Rota para cadastrar usuário
app.post("/cadastro", async (req, res) => {
  try {
    const { email, nome, idade } = req.body

    const usuario = await prisma.usuario.create({
      data: {
        email,
        nome,
        idade: Number.parseInt(idade),
      },
    })

    res.json(usuario)
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error)
    res.status(500).json({ error: "Erro ao cadastrar usuário" })
  }
})

// Rota para listar usuários
app.get("/cadastro", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany()
    res.json(usuarios)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    res.status(500).json({ error: "Erro ao buscar usuários" })
  }
})

// Rota para atualizar usuário
app.put("/cadastro/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { email, nome, idade } = req.body

    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        email,
        nome,
        idade: Number.parseInt(idade),
      },
    })

    res.json(usuario)
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    res.status(500).json({ error: "Erro ao atualizar usuário" })
  }
})

// Rota para deletar usuário
app.delete("/cadastro/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.usuario.delete({
      where: { id },
    })

    res.json({ message: "Usuário deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar usuário:", error)
    res.status(500).json({ error: "Erro ao deletar usuário" })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
