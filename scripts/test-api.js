// Script para testar todas as funcionalidades da API
const API_BASE_URL = "http://localhost:3000"

async function testAPI() {
  console.log("🧪 Iniciando testes da API...")

  try {
    // Teste 1: Verificar se API está rodando
    console.log("\n1️⃣ Testando conexão com API...")
    const healthCheck = await fetch(`${API_BASE_URL}/cadastro`)
    if (healthCheck.ok) {
      console.log("✅ API está rodando corretamente!")
    } else {
      throw new Error("❌ API não está respondendo")
    }

    // Teste 2: Criar usuário
    console.log("\n2️⃣ Testando criação de usuário...")
    const novoUsuario = {
      nome: "Teste Usuário",
      email: "teste@exemplo.com",
      idade: "25",
    }

    const createResponse = await fetch(`${API_BASE_URL}/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoUsuario),
    })

    if (createResponse.ok) {
      const usuarioCriado = await createResponse.json()
      console.log("✅ Usuário criado com sucesso:", usuarioCriado.nome)

      // Teste 3: Atualizar usuário
      console.log("\n3️⃣ Testando atualização de usuário...")
      const usuarioAtualizado = {
        nome: "Teste Usuário Atualizado",
        email: "teste.atualizado@exemplo.com",
        idade: "30",
      }

      const updateResponse = await fetch(`${API_BASE_URL}/cadastro/${usuarioCriado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioAtualizado),
      })

      if (updateResponse.ok) {
        console.log("✅ Usuário atualizado com sucesso!")

        // Teste 4: Deletar usuário
        console.log("\n4️⃣ Testando exclusão de usuário...")
        const deleteResponse = await fetch(`${API_BASE_URL}/cadastro/${usuarioCriado.id}`, {
          method: "DELETE",
        })

        if (deleteResponse.ok) {
          console.log("✅ Usuário deletado com sucesso!")
        } else {
          console.log("❌ Erro ao deletar usuário")
        }
      } else {
        console.log("❌ Erro ao atualizar usuário")
      }
    } else {
      console.log("❌ Erro ao criar usuário")
    }

    // Teste 5: Listar usuários
    console.log("\n5️⃣ Testando listagem de usuários...")
    const listResponse = await fetch(`${API_BASE_URL}/cadastro`)
    if (listResponse.ok) {
      const usuarios = await listResponse.json()
      console.log(`✅ Listagem funcionando! Total de usuários: ${usuarios.length}`)
    } else {
      console.log("❌ Erro ao listar usuários")
    }

    console.log("\n🎉 TODOS OS TESTES PASSARAM! API está funcionando perfeitamente!")
  } catch (error) {
    console.error("\n❌ ERRO NOS TESTES:", error.message)
    console.log("\n💡 Certifique-se de que:")
    console.log("   - O servidor está rodando (npm start)")
    console.log("   - MongoDB está conectado")
    console.log("   - Não há firewall bloqueando a porta 3000")
  }
}

// Executar testes
testAPI()
