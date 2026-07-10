import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { Role } from "../../../generated/prisma/client";



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



    if (![Role.CUSTOMER, Role.TECHNICIAN].includes(role)) {
        throw new Error(
            "Only CUSTOMER and TECHNICIAN roles are allowed during registration."
        );
    }


    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))


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

        if (role === 'TECHNICIAN') {
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




const loginUserIntoDB = async (payload: ILoginUser) => {
    const { email, password } = payload;

    // const user = await prisma.user.findUnique({
    //     where : {email}
    // })

    // if(!user){
    //     throw new Error("User not found");
    // }

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }

    })

    if (user.status === "BANNED") {
        throw new Error("Your account has been banned. Please contact support.");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    // const accessToken = jwt.sign(
    //     jwtPayload, 
    //     config.jwt_access_secret, 
    //     {
    //         expiresIn : config.jwt_access_expires_in
    //     } as SignOptions
    // )

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    // const refreshToken = jwt.sign(
    //     jwtPayload, 
    //     config.jwt_refresh_secret, 
    //     {
    //         expiresIn : config.jwt_refresh_expires_in
    //     } as SignOptions
    // );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );


    const showUser = await prisma.user.findUniqueOrThrow({
        where: {
            email
        },
        omit: {
            password: true
        }
    })



    return {
        showUser,
        accessToken,
        refreshToken
    };
}




const getLoggedInUserFromDB = async (userId: string) => {
    const user = userId;
    // const loggedInUser = await prisma.user.findUniqueOrThrow({

    const loggedInUser = await prisma.user.findUniqueOrThrow({

        where: {
            id: userId
        },
        omit: {
            password: true
        }
    });

    return loggedInUser;
};


const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.error)
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    if (user.status === "BANNED") {
        throw new Error("User is BANNED!")
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    }


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    return { accessToken }
}



export const authService = {
    registerUserIntoDB,
    loginUserIntoDB,
    getLoggedInUserFromDB,
    refreshToken
}