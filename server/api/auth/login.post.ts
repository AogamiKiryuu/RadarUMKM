import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  // Validation
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email dan password harus diisi',
    });
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Email atau password salah',
    });
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw createError({
      statusCode: 401,
      message: 'Email atau password salah',
    });
  }

  // Set session — berlaku 7 hari, lalu harus login ulang
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  }, { maxAge: 60 * 60 * 24 * 7 });

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
});
