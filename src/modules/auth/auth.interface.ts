
export type IRegisterUser = {
    name: string;
    email: string;
    password: string;

    role: 'CUSTOMER' | 'TECHNICIAN';
};

export type ILoginUser = {

    email: string;
    password: string;
};
