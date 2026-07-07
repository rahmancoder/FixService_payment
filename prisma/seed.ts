

// Admin SEEDING Here

import bcrypt from "bcryptjs";
import config from "../src/config";
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';
// import { PrismaClient, Role } from "../generated/prisma/client";

// Default Category SEEDING Here as category is connected to our  Technician service




import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});


// const prisma = new PrismaClient();
// const prisma = new PrismaClient({
//     // log: ("error" | "warn"| "info"| "query"),
//     // log: ["error" | "warn"| "info"| "query"],
// });

async function main() {
    const existingAdmin = await prisma.user.findUnique({
        where: { email: config.mustafiz_admin_email },
    });

    if (existingAdmin) {
        console.log('Admin already exists:', config.mustafiz_admin_email);
        return;
    }

    const hashedPassword = await bcrypt.hash(config.mustafiz_admin_password as string, Number(config.bcrypt_salt_rounds));

    const admin = await prisma.user.create({
        data: {
            name: 'FixItNow Admin',
            email: config.mustafiz_admin_email as string,
            password: hashedPassword,
            role: 'ADMIN',
            // role: Role.ADMIN,
        },
    });

    console.log('Admin account created successfully');
    console.log('   Email:', config.mustafiz_admin_email);
    console.log('   Password:', config.mustafiz_admin_password);

    const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry', 'AC Repair'];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name, description: `${name} services` },
        });
    }

    console.log('Default service categories seeded');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
