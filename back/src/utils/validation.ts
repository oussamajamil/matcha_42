export const isEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export const isPassword = (password: string) => {
    const re = /^[a,zA,Z]{3,7}$/;
    return re.test(password);
}

