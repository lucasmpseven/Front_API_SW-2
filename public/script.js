// Configuração da API
const API_BASE_URL = window.location.origin

// Elementos do DOM
const userForm = document.getElementById("user-form")
const formTitle = document.getElementById("form-title")
const submitBtn = document.getElementById("submit-btn")
const cancelBtn = document.getElementById("cancel-btn")
const refreshBtn = document.getElementById("refresh-btn")
const usersContainer = document.getElementById("users-container")
const loading = document.getElementById("loading")
const modal = document.getElementById("modal")
const confirmDeleteBtn = document.getElementById("confirm-delete")
const cancelDeleteBtn = document.getElementById("cancel-delete")

// Variáveis de controle
let editingUserId = null
let userToDelete = null

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadUsers()
  setupEventListeners()
  checkApiStatus()
})

async function checkApiStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/cadastro`)
    if (response.ok) {
      console.log("✅ API funcionando corretamente!")
    }
  } catch (error) {
    console.error("❌ Erro na conexão com API:", error)
    showMessage("Erro na conexão com a API. Verifique se o servidor está rodando.", "error")
  }
}

// Event Listeners
function setupEventListeners() {
  userForm.addEventListener("submit", handleFormSubmit)
  cancelBtn.addEventListener("click", cancelEdit)
  refreshBtn.addEventListener("click", loadUsers)
  confirmDeleteBtn.addEventListener("click", confirmDelete)
  cancelDeleteBtn.addEventListener("click", closeModal)

  // Fechar modal clicando fora
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  document.getElementById("email").addEventListener("blur", validateEmail)
  document.getElementById("nome").addEventListener("input", validateName)
  document.getElementById("idade").addEventListener("input", validateAge)
}

function validateEmail(e) {
  const email = e.target.value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (email && !emailRegex.test(email)) {
    e.target.style.borderColor = "#e53e3e"
    showFieldError(e.target, "Email inválido")
  } else {
    e.target.style.borderColor = "#e2e8f0"
    removeFieldError(e.target)
  }
}

function validateName(e) {
  const name = e.target.value

  if (name && name.length < 2) {
    e.target.style.borderColor = "#e53e3e"
    showFieldError(e.target, "Nome deve ter pelo menos 2 caracteres")
  } else {
    e.target.style.borderColor = "#e2e8f0"
    removeFieldError(e.target)
  }
}

function validateAge(e) {
  const age = Number.parseInt(e.target.value)

  if (age && (age < 1 || age > 120)) {
    e.target.style.borderColor = "#e53e3e"
    showFieldError(e.target, "Idade deve estar entre 1 e 120 anos")
  } else {
    e.target.style.borderColor = "#e2e8f0"
    removeFieldError(e.target)
  }
}

function showFieldError(field, message) {
  removeFieldError(field)
  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.textContent = message
  errorDiv.style.color = "#e53e3e"
  errorDiv.style.fontSize = "12px"
  errorDiv.style.marginTop = "4px"
  field.parentNode.appendChild(errorDiv)
}

function removeFieldError(field) {
  const existingError = field.parentNode.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }
}

// Carregar usuários da API
async function loadUsers() {
  try {
    showLoading(true)
    const response = await fetch(`${API_BASE_URL}/cadastro`)

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    const users = await response.json()
    displayUsers(users)
    showLoading(false)

    updateUserCount(users.length)
  } catch (error) {
    console.error("Erro:", error)
    showMessage("Erro ao carregar usuários. Verifique se a API está rodando.", "error")
    showLoading(false)
  }
}

function updateUserCount(count) {
  const header = document.querySelector(".users-section h2")
  header.textContent = `Usuários Cadastrados (${count})`
}

// Exibir usuários na tela
function displayUsers(users) {
  if (users.length === 0) {
    usersContainer.innerHTML =
      '<div style="text-align: center; color: #718096; padding: 40px; background: #f7fafc; border-radius: 10px; border: 2px dashed #e2e8f0;"><h3>Nenhum usuário cadastrado</h3><p>Cadastre o primeiro usuário usando o formulário ao lado!</p></div>'
    return
  }

  const usersHTML = users
    .map(
      (user) => `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-info">
                <div class="user-details">
                    <h3>${escapeHtml(user.nome)}</h3>
                    <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
                    <p><strong>Idade:</strong> ${escapeHtml(user.idade)} anos</p>
                    <p class="user-id"><strong>ID:</strong> ${user.id}</p>
                </div>
                <div class="user-actions">
                    <button class="edit-btn" onclick="editUser('${user.id}', '${escapeHtml(user.nome)}', '${escapeHtml(user.email)}', '${user.idade}')">
                        ✏️ Editar
                    </button>
                    <button class="delete-btn" onclick="showDeleteModal('${user.id}', '${escapeHtml(user.nome)}')">
                        🗑️ Excluir
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  usersContainer.innerHTML = usersHTML
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// Manipular envio do formulário
async function handleFormSubmit(e) {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  const formData = new FormData(userForm)
  const userData = {
    nome: formData.get("nome").trim(),
    email: formData.get("email").trim().toLowerCase(),
    idade: formData.get("idade"),
  }

  try {
    submitBtn.disabled = true
    submitBtn.textContent = editingUserId ? "Atualizando..." : "Cadastrando..."

    let response

    if (editingUserId) {
      // Atualizar usuário existente
      response = await fetch(`${API_BASE_URL}/cadastro/${editingUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
    } else {
      // Criar novo usuário
      response = await fetch(`${API_BASE_URL}/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
    }

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Erro ao salvar usuário")
    }

    const message = editingUserId ? "Usuário atualizado com sucesso!" : "Usuário cadastrado com sucesso!"
    showMessage(message, "success")

    userForm.reset()
    cancelEdit()
    await loadUsers()

    if (result.id) {
      highlightUser(result.id)
    }
  } catch (error) {
    console.error("Erro:", error)
    showMessage(error.message || "Erro ao salvar usuário. Tente novamente.", "error")
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = editingUserId ? "Atualizar" : "Cadastrar"
  }
}

function validateForm() {
  const nome = document.getElementById("nome").value.trim()
  const email = document.getElementById("email").value.trim()
  const idade = document.getElementById("idade").value

  if (nome.length < 2) {
    showMessage("Nome deve ter pelo menos 2 caracteres", "error")
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    showMessage("Email inválido", "error")
    return false
  }

  const ageNum = Number.parseInt(idade)
  if (ageNum < 1 || ageNum > 120) {
    showMessage("Idade deve estar entre 1 e 120 anos", "error")
    return false
  }

  return true
}

function highlightUser(userId) {
  setTimeout(() => {
    const userCard = document.querySelector(`[data-user-id="${userId}"]`)
    if (userCard) {
      userCard.style.background = "#c6f6d5"
      userCard.style.border = "2px solid #48bb78"

      setTimeout(() => {
        userCard.style.background = "#f7fafc"
        userCard.style.border = "1px solid #e2e8f0"
      }, 2000)
    }
  }, 100)
}

// Editar usuário
function editUser(id, nome, email, idade) {
  editingUserId = id

  document.getElementById("nome").value = nome
  document.getElementById("email").value = email
  document.getElementById("idade").value = idade

  formTitle.textContent = "Editar Usuário"
  submitBtn.textContent = "Atualizar"
  cancelBtn.style.display = "block"

  // Scroll para o formulário
  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" })

  document.getElementById("nome").focus()
}

// Cancelar edição
function cancelEdit() {
  editingUserId = null
  userForm.reset()
  formTitle.textContent = "Cadastrar Novo Usuário"
  submitBtn.textContent = "Cadastrar"
  cancelBtn.style.display = "none"

  document.querySelectorAll(".field-error").forEach((error) => error.remove())
  document.querySelectorAll("input").forEach((input) => {
    input.style.borderColor = "#e2e8f0"
  })
}

// Mostrar modal de confirmação de exclusão
function showDeleteModal(id, nome) {
  userToDelete = id
  modal.querySelector("p").textContent =
    `Tem certeza que deseja excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`
  modal.style.display = "block"

  cancelDeleteBtn.focus()
}

// Confirmar exclusão
async function confirmDelete() {
  if (!userToDelete) return

  try {
    confirmDeleteBtn.disabled = true
    confirmDeleteBtn.textContent = "Excluindo..."

    const response = await fetch(`${API_BASE_URL}/cadastro/${userToDelete}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || "Erro ao excluir usuário")
    }

    showMessage("Usuário excluído com sucesso!", "success")
    await loadUsers()
    closeModal()
  } catch (error) {
    console.error("Erro:", error)
    showMessage(error.message || "Erro ao excluir usuário. Tente novamente.", "error")
  } finally {
    confirmDeleteBtn.disabled = false
    confirmDeleteBtn.textContent = "Sim, Excluir"
  }
}

// Fechar modal
function closeModal() {
  modal.style.display = "none"
  userToDelete = null
}

// Mostrar/ocultar loading
function showLoading(show) {
  loading.style.display = show ? "block" : "none"
  usersContainer.style.display = show ? "none" : "block"
}

// Mostrar mensagens de sucesso/erro
function showMessage(message, type) {
  // Remove mensagem anterior se existir
  const existingMessage = document.querySelector(".success-message, .error-message")
  if (existingMessage) {
    existingMessage.remove()
  }

  const messageDiv = document.createElement("div")
  messageDiv.className = type === "success" ? "success-message" : "error-message"
  messageDiv.textContent = message

  const formSection = document.querySelector(".form-section")
  formSection.insertBefore(messageDiv, formSection.firstChild)

  messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })

  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove()
    }
  }, 5000)
}

document.addEventListener("keydown", (e) => {
  // ESC para cancelar edição ou fechar modal
  if (e.key === "Escape") {
    if (modal.style.display === "block") {
      closeModal()
    } else if (editingUserId) {
      cancelEdit()
    }
  }

  // F5 para atualizar lista
  if (e.key === "F5" && !e.ctrlKey) {
    e.preventDefault()
    loadUsers()
  }
})

// setInterval(loadUsers, 30000)
