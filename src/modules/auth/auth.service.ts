import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IRegisterUser } from "./auth.interface";



const registerUserIntoDB = async (payload: IRegisterUser) => {

    const { name, email, password, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        }
    })


    if (isUserExist) {
        throw new Error("User with this email already exists");
    }


    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))



    // const createdUser = await prisma.user.create({
    //     data: {
    //         name,
    //         email,
    //         password: hashedPassword,
    //         role
    //     }
    // });



    // const user = await prisma.user.findUnique({
    //     where: {
    //         id: createdUser.id,
    //         email: createdUser.email || email
    //     },
    //     omit: {
    //         password: true
    //     },

    // })



    // Needs to handle User Role : Technician  and role Admin shouldn't create  

    const result = await prisma.$transaction(async tx => {
        const user = await tx.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });

        if (payload.role === 'TECHNICIAN') {
            await tx.technicianProfile.create({
                data: {
                    userId: user.id,
                    skills: []
                },
            });
        }

        return user;
    });


    // return user;

    //   const { password, ...userWithoutPassword } = result;

    // return { user: userWithoutPassword };


    const createdUser = await prisma.user.findUnique({
        where: {
            id: result.id,
            email: result.email || email
        },

        omit: {
            password: true
        },

    })

    return createdUser;


}

export const authService = {
    registerUserIntoDB,
}