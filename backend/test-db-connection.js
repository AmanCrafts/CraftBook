import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function testConnection() {
    try {
        await prisma.$connect();
        console.log('[SUCCESS] Database connected successfully!');
        
        // Try a simple query
        const userCount = await prisma.user.count();
        console.log(`📊 Total users in database: ${userCount}`);
        
        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Database connection failed!');
        console.error('Error:', error.message);
        console.error('\n🔍 Possible causes:');
        console.error('1. Supabase project is paused (free tier)');
        console.error('2. Database credentials changed');
        console.error('3. Network/firewall issues');
        console.error('\n[TIP] Solution:');
        console.error('• Go to https://supabase.com/dashboard');
        console.error('• Check if your project is active');
        console.error('• If paused, click "Restore" to wake it up');
        console.error('• Update DATABASE_URL in .env if credentials changed');
        
        await prisma.$disconnect();
        process.exit(1);
    }
}

testConnection();
