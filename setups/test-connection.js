const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔌 Testando conexão com o banco de dados...');
    await prisma.$connect();
    
    const userCount = await prisma.usuario.count();
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log(`📊 Total de usuários no banco: ${userCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();