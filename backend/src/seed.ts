import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.admin.findUnique({ where: { username: 'admin' } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({ data: { username: 'admin', passwordHash } });
    console.log('Default admin created: admin / admin123');
  }

  const employeeCount = await prisma.employee.count();
  if (employeeCount === 0) {
    await prisma.employee.createMany({
      data: [
        { name: 'Ana Silva', email: 'ana.silva@empresa.com', extension: '1001', sector: 'RH', birthday: '03-15' },
        { name: 'Bruno Costa', email: 'bruno.costa@empresa.com', extension: '1002', sector: 'TI', birthday: '03-22' },
        { name: 'Carla Mendes', email: 'carla.mendes@empresa.com', extension: '1003', sector: 'Financeiro', birthday: '06-10' },
        { name: 'Daniel Oliveira', email: 'daniel.oliveira@empresa.com', extension: '1004', sector: 'TI', birthday: '11-05' },
        { name: 'Elena Ferreira', email: 'elena.ferreira@empresa.com', extension: '1005', sector: 'Comercial', birthday: '08-28' },
      ],
    });
    console.log('Sample employees created');
  }

  const annCount = await prisma.announcement.count();
  if (annCount === 0) {
    await prisma.announcement.createMany({
      data: [
        { title: 'Bem-vindos ao novo portal!', message: 'Este é o novo portal da intranet da empresa. Aqui você encontra informações sobre seus colegas, comunicados e links úteis.' },
        { title: 'Reunião geral – 10/03', message: 'Haverá uma reunião geral no dia 10/03 às 14h na sala de conferências. Presença obrigatória.' },
      ],
    });
    console.log('Sample announcements created');
  }

  const linkCount = await prisma.link.count();
  if (linkCount === 0) {
    await prisma.link.createMany({
      data: [
        { name: 'Sistema de Ponto', url: 'http://ponto.intra' },
        { name: 'Portal de RH', url: 'http://rh.intra' },
        { name: 'Intranet Anterior', url: 'http://intranet-old.intra' },
      ],
    });
    console.log('Sample links created');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
