import { BadRequestError, NotFoundError } from "../middleware/errors/ApiErrors";
import { User } from "../model/User";
import { UserRepository } from "../repository/UserRepository";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
require('dotenv').config();

const userRepository = new UserRepository()

export class UserService {

    async login(formLogin: User) {
      const { email, password } = formLogin
      const user = await userRepository.returnUserAccountByEmail(email)

      if(user === null) {
        throw new NotFoundError('Usuário não encontrado. Verifique se o email ou senha estão informados corretamente')
      }
      
      const verifyPassword = await bcryptjs.compare(password, user.password)
      if(!verifyPassword) {
        throw new BadRequestError('E-mail ou senha inválidos')
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_PASSWORD ?? '', {
        expiresIn: '8h',
      })

      const { password: _, ...userData } = user

      return token
    }
    
    async returnAllUsersAccounts() {
       return await userRepository.returnAllUsersAccounts()
    }

    async returnUserAccountByEmail(email: String) {
      const user = await userRepository.returnUserAccountByEmail(email)
      if(user === null) {
        throw new NotFoundError('Usuário não encontrado. Verifique se o email informado está correto.')
      } else {
        return user
      }
    }

    async returnUserAccountById(id: number) {
      const user = await userRepository.returnUserAccountById(id)
      if(user === null) {
        throw new NotFoundError('Usuário não encontrado')
      } else {
        return user
      }
    }
    
    async createUser(userData: User) {
        const { email, password } = userData
        const verifyUserExist = await userRepository.returnUserAccountByEmail(email)
        
        if(verifyUserExist != null) {
          throw new BadRequestError('O Email informado já está cadastrado.')
        }

        const validateFields = await this.hasEmptyFields(userData)
        if (validateFields === true) {
          throw new BadRequestError('Verifique se os campos estão preenchidos corretamente.')
        }
        
        const hashPassword = await bcryptjs.hash(password, 10)
        userData.password = hashPassword
        
        await userRepository.registerUser(userData)
    }

    async updateUserEmail(originalEmail: String, userEmail: String) {
        const user = await userRepository.returnUserAccountByEmail(originalEmail) 
        if (user === null) {
          throw new NotFoundError('Usuário não encontrado. Verifique se o email informado está correto.')
        }

        const validateFields = await this.hasEmptyFields(userEmail)
        if(validateFields === true) {
            throw new BadRequestError('Verifique se o email é válido.')
        }
       return await userRepository.updateUserEmail(originalEmail, userEmail)
    }

    async updateUserPassword(email: String, userPassword: String) {
        const user = await userRepository.returnUserAccountByEmail(email) 
        if (user === null) {
          throw new NotFoundError('Usuário não encontrado. Verifique se o email informado está correto.')
        }

        const validateFields = await this.hasEmptyFields(userPassword)
        if(validateFields === true) {
            throw new BadRequestError('Verifique se a senha é válida.')
        }
        return await userRepository.updateUserPassword(email, userPassword)
    }

    async deleteAccount(email: String) {
        const user = await userRepository.returnUserAccountByEmail(email) 
        if (user === null) {
          throw new NotFoundError('Usuário não encontrado. Verifique se o email informado está correto.')
        }

        return await userRepository.deleteAccount(email)
    }

    async hasEmptyFields<T>(obj: T): Promise<boolean> {
        for (let key in obj) {
          if (typeof obj[key] === "object") {
            if (await this.hasEmptyFields(obj[key])) {
              return true;
            }
          } else {
            if (!obj[key]) {
              return true;
            }
          }
        }
        return false;
    }
}