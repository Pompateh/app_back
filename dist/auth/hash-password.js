"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
async function hashPassword() {
    const plainTextPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    console.log('Hashed Password:', hashedPassword);
}
hashPassword();
//# sourceMappingURL=hash-password.js.map