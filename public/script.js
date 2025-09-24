// ===========================
// Configuração da API
// ===========================
const API_BASE_URL = window.location.origin;

// ===========================
// Elementos do DOM
// ===========================
const userForm = document.getElementById("user-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const refreshBtn = document.getElementById("refresh-btn");
const usersContainer = document.getElementById("users-container");
const loading = document.getElementById("loading");
const modal = document.getElementById("modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const modalMessage = document.getElementById("modal-message");

// ===========================
// Variáveis de controle
// ===========================
let editingUserId = null;
let userToDelete = null;

// ===========================
// Inicialização
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

async function initializeApp() {
    try {
        await checkApiStatus();
        await loadUsers();
        setupEventListeners();
        setupKeyboardShortcuts();
    } catch (error) {
        console.error("Erro na inicialização:", error);
        showMessage("Erro ao inicializar a aplicação", "error");
    }
}

// ===========================
// Verificar status da API
// ===========================
async function checkApiStatus() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_BASE_URL}/health`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            console.log("✅ API funcionando corretamente:", data);
            return true;
        } else {
            throw new Error(`API retornou status ${response.status}`);
        }
    } catch (error) {
        console.error("❌ Erro na conexão com API:", error);
        showMessage("Erro na conexão com a API. Verifique se o servidor está rodando.", "error");
        return false;
    }
}

// ===========================
// Configurar Event Listeners
// ===========================
function setupEventListeners() {
    // Formulário
    userForm.addEventListener("submit", handleFormSubmit);
    cancelBtn.addEventListener("click", cancelEdit);
    refreshBtn.addEventListener("click", handleRefresh);

    // Modal de confirmação
    confirmDeleteBtn.addEventListener("click", confirmDelete);
    cancelDeleteBtn.addEventListener("click", closeModal);

    // Fechar modal clicando fora ou pressionando ESC
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Validações em tempo real
    setupFieldValidations();

    // Prevenção de F5
    document.addEventListener("keydown", handleKeyDown);
}

function setupFieldValidations() {
    const emailField = document.getElementById("email");
    const nomeField = document.getElementById("nome");
    const idadeField = document.getElementById("idade");

    emailField.addEventListener("blur", () => validateEmail(emailField.value));
    emailField.addEventListener("input", () => clearFieldError(emailField));

    nomeField.addEventListener("blur", () => validateName(nomeField.value));
    nomeField.addEventListener("input", () => clearFieldError(nomeField));

    idadeField.addEventListener("blur", () => validateAge(idadeField.value));
    idadeField.addEventListener("input", () => clearFieldError(idadeField));
}

function setupKeyboardShortcuts() {
    document.addEventListener("keydown", handleKeyDown);
}

// ===========================
// Validações de campos
// ===========================
function validateEmail(email) {
    const emailField = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        showFieldError(emailField, "Email inválido");
        return false;
    } else {
        clearFieldError(emailField);
        return true;
    }
}

function validateName(name) {
    const nomeField = document.getElementById("nome");
    
    if (name && name.length < 2) {
        showFieldError(nomeField, "Nome deve ter pelo menos 2 caracteres");
        return false;
    } else {
        clearFieldError(nomeField);
        return true;
    }
}

function validateAge(age) {
    const idadeField = document.getElementById("idade");
    const ageNum = parseInt(age, 10);
    
    if (age && (isNaN(ageNum) || ageNum < 1 || ageNum > 120)) {
        showFieldError(idadeField, "Idade deve estar entre 1 e 120 anos");
        return false;
    } else {
        clearFieldError(idadeField);
        return true;
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = "#e53e3e";
    
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e53e3e;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 500;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = "#e2e8f0";
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
        existingError.remove();
    }
}

// ===========================
// Carregar usuários
// ===========================
async function loadUsers() {
    try {
        showLoading(true);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE_URL}/cadastro`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const users = await response.json();
        displayUsers(users);
        updateUserCount(users.length);
        
        return users;
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        
        if (error.name === 'AbortError') {
            showMessage("Tempo limite excedido ao carregar usuários", "error");
        } else {
            showMessage("Erro ao carregar usuários. Verifique a conexão com a API.", "error");
        }
        
        return [];
    } finally {
        showLoading(false);
    }
}

async function handleRefresh() {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '🔄 Atualizando...';
    
    await loadUsers();
    
    setTimeout(() => {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '🔄 Atualizar Lista';
    }, 1000);
}

function updateUserCount(count) {
    const header = document.querySelector(".users-section h2");
    if (header) {
        header.textContent = `Usuários Cadastrados (${count})`;
    }
}

// ===========================
// Exibir usuários
// ===========================
function displayUsers(users) {
    if (!usersContainer) return;

    if (!users || users.length === 0) {
        usersContainer.innerHTML = `
            <div class="empty-state">
                <h3>📝 Nenhum usuário cadastrado</h3>
                <p>Cadastre o primeiro usuário usando o formulário ao lado!</p>
            </div>
        `;
        return;
    }

    const usersHTML = users
        .map((user) => `
            <div class="user-card" data-user-id="${user.id}">
                <div class="user-info">
                    <div class="user-details">
                        <h3>${escapeHtml(user.nome)}</h3>
                        <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
                        <p><strong>Idade:</strong> ${user.idade} anos</p>
                        <p class="user-id"><strong>ID:</strong> <span class="id-truncate">${user.id}</span></p>
                    </div>
                    <div class="user-actions">
                        <button class="edit-btn" onclick="editUser('${user.id}', '${escapeHtml(user.nome)}', '${escapeHtml(user.email)}', ${user.idade})">
                            ✏️ Editar
                        </button>
                        <button class="delete-btn" onclick="showDeleteModal('${user.id}', '${escapeHtml(user.nome)}')">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            </div>
        `)
        .join("");

    usersContainer.innerHTML = usersHTML;
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.toString().replace(/[&<>"']/g, (m) => map[m]);
}

// ===========================
// Manipulação do Formulário
// ===========================
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData(userForm);
    const userData = {
        nome: formData.get("nome").trim(),
        email: formData.get("email").trim().toLowerCase(),
        idade: parseInt(formData.get("idade"), 10)
    };

    try {
        setSubmitButtonState(true);

        let url = `${API_BASE_URL}/cadastro`;
        let method = 'POST';
        
        if (editingUserId) {
            url = `${API_BASE_URL}/cadastro/${editingUserId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Erro ${response.status} ao salvar usuário`);
        }

        showMessage(
            editingUserId ? "✅ Usuário atualizado com sucesso!" : "✅ Usuário cadastrado com sucesso!", 
            "success"
        );

        resetForm();
        await loadUsers();

        if (result.id) {
            highlightUser(result.id);
        }
    } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        showMessage(error.message || "Erro ao salvar usuário. Tente novamente.", "error");
    } finally {
        setSubmitButtonState(false);
    }
}

function setSubmitButtonState(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading 
        ? (editingUserId ? "⏳ Atualizando..." : "⏳ Cadastrando...")
        : (editingUserId ? "💾 Atualizar" : "✨ Cadastrar");
}

function validateForm() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const idade = document.getElementById("idade").value;

    let isValid = true;

    if (nome.length < 2) {
        showFieldError(document.getElementById("nome"), "Nome deve ter pelo menos 2 caracteres");
        isValid = false;
    }

    if (!validateEmail(email)) {
        isValid = false;
    }

    if (!validateAge(idade)) {
        isValid = false;
    }

    if (!isValid) {
        showMessage("Por favor, corrija os erros no formulário", "error");
    }

    return isValid;
}

function resetForm() {
    userForm.reset();
    editingUserId = null;
    formTitle.textContent = "Cadastrar Novo Usuário";
    submitBtn.textContent = "Cadastrar";
    cancelBtn.style.display = "none";
    
    // Limpar erros de campo
    document.querySelectorAll("input").forEach(clearFieldError);
}

// ===========================
// Editar usuário
// ===========================
function editUser(id, nome, email, idade) {
    editingUserId = id;
    
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
    document.getElementById("idade").value = idade;

    formTitle.textContent = "Editar Usuário";
    submitBtn.textContent = "Atualizar";
    cancelBtn.style.display = "block";

    // Scroll suave para o formulário
    document.querySelector(".form-section").scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
    });
    
    document.getElementById("nome").focus();
}

function cancelEdit() {
    resetForm();
    showMessage("Edição cancelada", "info");
}

// ===========================
// Excluir usuário
// ===========================
function showDeleteModal(id, nome) {
    userToDelete = id;
    
    if (modalMessage) {
        modalMessage.textContent = `Tem certeza que deseja excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`;
    }
    
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    
    cancelDeleteBtn.focus();
}

async function confirmDelete() {
    if (!userToDelete) return;

    try {
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = "⏳ Excluindo...";

        const response = await fetch(`${API_BASE_URL}/cadastro/${userToDelete}`, { 
            method: "DELETE" 
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || `Erro ${response.status} ao excluir usuário`);
        }

        showMessage("✅ Usuário excluído com sucesso!", "success");
        await loadUsers();
        closeModal();
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        showMessage(error.message || "Erro ao excluir usuário. Tente novamente.", "error");
    } finally {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = "✅ Sim, Excluir";
    }
}

function closeModal() {
    modal.style.display = "none";
    userToDelete = null;
}

// ===========================
// Utilitários
// ===========================
function showLoading(show) {
    if (loading) loading.style.display = show ? "block" : "none";
    if (usersContainer) usersContainer.style.display = show ? "none" : "block";
}

function showMessage(message, type) {
    // Remover mensagens existentes
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 12px 16px;
        margin: 10px 0;
        border-radius: 8px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        ${type === 'success' ? 'background: #c6f6d5; color: #22543d; border: 1px solid #48bb78;' : ''}
        ${type === 'error' ? 'background: #fed7d7; color: #742a2a; border: 1px solid #e53e3e;' : ''}
        ${type === 'info' ? 'background: #bee3f8; color: #1a365d; border: 1px solid #3182ce;' : ''}
    `;

    const formSection = document.querySelector(".form-section");
    if (formSection) {
        formSection.insertBefore(messageDiv, formSection.firstChild);
        
        // Scroll para a mensagem
        messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }
}

function highlightUser(userId) {
    setTimeout(() => {
        const userCard = document.querySelector(`[data-user-id="${userId}"]`);
        if (userCard) {
            userCard.style.transition = "all 0.3s ease";
            userCard.style.background = "#c6f6d5";
            userCard.style.border = "2px solid #48bb78";
            userCard.style.transform = "scale(1.02)";

            setTimeout(() => {
                userCard.style.background = "";
                userCard.style.border = "";
                userCard.style.transform = "";
            }, 2000);
        }
    }, 100);
}

function handleKeyDown(e) {
    // ESC - Fechar modal ou cancelar edição
    if (e.key === "Escape") {
        if (modal.style.display === "flex") {
            closeModal();
        } else if (editingUserId) {
            cancelEdit();
        }
    }

    // F5 - Atualizar lista (com Ctrl para forçar recarregamento completo)
    if (e.key === "F5") {
        if (!e.ctrlKey) {
            e.preventDefault();
            handleRefresh();
        }
    }

    // Ctrl+Enter - Submeter formulário
    if (e.ctrlKey && e.key === "Enter") {
        if (userForm.checkValidity()) {
            handleFormSubmit(new Event('submit'));
        }
    }
}

// ===========================
// Estilos CSS dinâmicos
// ===========================
function injectDynamicStyles() {
    const styles = `
        @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-10px); opacity: 0; }
        }
        
        .empty-state {
            text-align: center;
            color: #718096;
            padding: 40px;
            background: #f7fafc;
            border-radius: 10px;
            border: 2px dashed #e2e8f0;
        }
        
        .id-truncate {
            font-family: monospace;
            font-size: 11px;
            word-break: break-all;
            opacity: 0.7;
        }
        
        .user-card {
            transition: all 0.3s ease;
        }
        
        .message {
            transition: all 0.3s ease;
        }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Injetar estilos dinâmicos
injectDynamicStyles();

// ===========================
// Exportar funções para escopo global (necessário para onclick)
// ===========================
window.editUser = editUser;
window.showDeleteModal = showDeleteModal;