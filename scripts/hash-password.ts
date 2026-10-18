import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function hashPassword() {
  try {
    console.log('🔐 Hashing user password...');

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'admin@presspoint.com' }
    });

    if (!user) {
      console.log('❌ User not found! Please run create-admin.ts first.');
      await prisma.$disconnect();
      return;
    }

    console.log('✅ User found!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('📝 Current password hash:', user.password);

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('✅ New hashed password created');

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@presspoint.com' },
      data: {
        password: hashedPassword,
        role: 'superadmin'
      }
    });

    console.log('✅ User updated successfully!');
    console.log('📧 Email:', updatedUser.email);
    console.log('🔑 Password: admin123 (now hashed)');
    console.log('🎭 Role:', updatedUser.role);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

hashPassword();