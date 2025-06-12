import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = new (jest.requireMock('@prisma/client').PrismaClient)(); // Use the mocked PrismaClient
  });

  it('should validate login successfully', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const fakeUser = { email: 'admin@example.com', password: hashedPassword, role: 'admin' };
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    const result = await service.login({ email: 'admin@example.com', password: 'password123' });
    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe('admin@example.com');
  });

  it('should fail login with wrong password', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const fakeUser = { email: 'admin@example.com', password: hashedPassword };
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    await expect(
      service.login({ email: 'admin@example.com', password: 'wrongpassword' }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('should fail login if user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nonexistent@example.com', password: 'password123' }),
    ).rejects.toThrow('Invalid credentials');
  });
});