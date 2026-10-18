import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    console.log('🌱 Creating admin user...');

    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@presspoint.com' }
    });

    let user;

    if (existingUser) {
      // Update existing user
      user = await prisma.user.update({
        where: { email: 'admin@presspoint.com' },
        data: {
          password: hashedPassword,
          name: 'Super Admin',
          role: 'superadmin'
        }
      });
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: 'admin@presspoint.com',
          password: hashedPassword,
          name: 'Super Admin',
          role: 'superadmin'
        }
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log('📧 Email:', user.email);
    console.log('🔑 Password: Admin@123456');
    console.log('👤 Name:', user.name);
    console.log('🎭 Role:', user.role);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();