import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { prisma } from './db.server';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export const authenticator = new Authenticator<User>();

async function login(email: FormDataEntryValue | null, password: FormDataEntryValue | null): Promise<User> {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required');
  }

  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }

  const whitelisted = await prisma.whitelistedEmail.findUnique({
    where: { email },
  });

  if (!whitelisted) {
    throw new Error('Email not whitelisted');
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function requireUser(request: Request) {
  const user = await authenticator.authenticate('user-pass', request);
  return user;
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');

    return await login(email, password);
  }),
  'user-pass',
);
