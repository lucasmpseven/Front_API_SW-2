const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn']
  });
  
  try {
    console.log('🧪 Executando testes no banco de dados...');
    
    // Teste 1: Conexão
    await prisma.$connect();
    console.log('✅ Teste 1/3: Conexão - OK');
    
    // Teste 2: Contagem
    const count = await prisma.usuario.count();
    console.log(`✅ Teste 2/3: Contagem (${count} usuários) - OK`);
    
    // Teste 3: CRUD Básico
    const testUser = await prisma.usuario.create({
      data: {
        nome: "Usuário Teste",
        email: `test-${Date.now()}@email.com`,
        idade: 99
      }
    });
    console.log('✅ Teste 3/3: Criação - OK');
    
    // Limpeza
    await prisma.usuario.delete({ where: { id: testUser.id } });
    
    console.log('🎉 Todos os testes passaram! Banco de dados funcionando perfeitamente.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Teste falhou:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();