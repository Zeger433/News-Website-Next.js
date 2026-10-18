import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    const email = 'admin@presspoint.com';
    const password = 'Admin@123456'; // Change this to test different passwords

    console.log('🔍 Testing login...');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);

    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      console.log('❌ User not found!');
      await prisma.$disconnect();
      return;
    }

    console.log('✅ User found!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🎭 Role:', user.role);
    console.log('🔑 Stored password hash:', user.password);

    const isValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isValid);

    if (isValid) {
      console.log('🎉 Login would work!');
      console.log('✅ Try logging in at: http://localhost:3000/login');
    } else {
      console.log('❌ Password mismatch!');
      console.log('💡 Try running: npx tsx scripts/hash-password.ts');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

testLogin();