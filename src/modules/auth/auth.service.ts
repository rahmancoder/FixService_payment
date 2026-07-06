import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";



const registerUserIntoDB = async (payload: any) => {

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



    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        }
    });



    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email
        },
        omit: {
            password: true
        },

    })



    // Needs to handle User Role : Technician  and role Admin shouldn't create  
    return user;

}

export const authService = {
    registerUserIntoDB,
}