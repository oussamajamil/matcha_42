
import * as bcrypt from 'bcryptjs';

export async function hashPassword(password:string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }