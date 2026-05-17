import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';

interface TokenPayload {
  sub: string;
  email: string;
}

const TOKEN_EXPIRY = '24h';
const SALT_ROUNDS = 12;

export function signToken(adminId: string, email: string): string {
  return jwt.sign({ sub: adminId, email }, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<{ token: string; user: { id: string; name: string; email: string } } | null> {
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin) {
    return null;
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return null;
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signToken(admin.id, admin.email);

  return {
    token,
    user: { id: admin.id, name: admin.name, email: admin.email },
  };
}
