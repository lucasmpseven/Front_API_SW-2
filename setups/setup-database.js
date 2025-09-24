const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Configurando banco de dados...');
    
    // Verificar se já existem usuários
    const userCount = await prisma.usuario.count();
    
    if (userCount === 0) {
      console.log('📝 Criando usuários de exemplo...');
      
      const sampleUsers = [
        { nome: "João Silva", email: "joao@email.com", idade: 30 },
        { nome: "Maria Santos", email: "maria@email.com", idade: 25 },
        { nome: "Pedro Costa", email: "pedro@email.com", idade: 35 },
        { nome: "Ana Oliveira", email: "ana@email.com", idade: 28 },
        { nome: "Carlos Souza", email: "carlos@email.com", idade: 42 }
      ];
      
      for (const user of sampleUsers) {
        try {
          await prisma.usuario.create({ data: user });
          console.log(`✅ ${user.nome} criado`);
        } catch (error) {
          if (error.code !== 'P2002') {
            throw error;
          }
          console.log(`⚠️ ${user.email} já existe`);
        }
      }
      
      console.log('🎉 Banco de dados configurado com sucesso!');
    } else {
      console.log(`📊 Banco já contém ${userCount} usuários. Nenhuma ação necessária.`);
    }
    
  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();