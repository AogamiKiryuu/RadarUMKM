import bcrypt from 'bcrypt';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readBody(event);

  // Validation
  if (!email || !password || !name) {
    throw createError({
      statusCode: 400,
      message: 'Email, password, dan nama harus diisi',
    });
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'Email sudah terdaftar',
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    user,
  };
});
