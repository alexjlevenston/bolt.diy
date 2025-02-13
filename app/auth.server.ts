import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { prisma } from './db.server';
import bcrypt from 'bcryptjs';

// Define user type based on what you want to store in the session
type User = {
  id: string;
  email: string;
};

// Create an instance of the authenticator
export const authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');
    const hashedPassword = await bcrypt.hash(password as string, process.env.DB_SALT as string);

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const isWhitelisted = await prisma.whitelistedEmail.findUnique({ where: { email } });

    if (!isWhitelisted) {
      throw new Error('User is not whitelisted');
    }

    const prismaUser = await prisma.user.findUnique({ where: { email } });

    if (!prismaUser) {
      const user = await prisma.user.create({ data: { email, password: hashedPassword } });
      return {
        id: user.id,
        email: user.email,
      };
    }

    const isValid = await bcrypt.compare(hashedPassword as string, prismaUser.password);

    if (!isValid) {
      throw new Error('Incorrect password');
    }

    return {
      id: prismaUser.id,
      email: prismaUser.email,
    };
  }),
  'user-pass',
);
