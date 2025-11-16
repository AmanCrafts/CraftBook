import { PrismaClient } from '../../generated/prisma/index.js';

/**
 * Database Module
 * Simple module for Prisma Client with singleton pattern
 */

// Create Prisma Client instance (singleton)
const prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Get Prisma Client instance
 */
export function getClient() {
    return prismaClient;
}

/**
 * Connect to database
 */
export async function connect() {
    try {
        await prismaClient.$connect();
        console.log('[DB] Database connected successfully');
    } catch (error) {
        console.error('[DB] Database connection failed:', error);
        throw error;
    }
}

/**
 * Disconnect from database
 */
export async function disconnect() {
    await prismaClient.$disconnect();
    console.log('🔌 Database disconnected');
}

// Export prisma client directly
export const prisma = prismaClient;

// Default export for compatibility
export default {
    getClient,
    connect,
    disconnect,
    prisma: prismaClient,
};
