import { Request, Response } from "express";
import { UserService } from "../service/UserService";

const userService = new  UserService()

export class UserController {

    async login(req: Request, res: Response) {
       const token = await userService.login(req.body)
       return res.json({token})
    }

    async returnAllUsersAccounts(req: Request, res: Response) {
        const response = await userService.returnAllUsersAccounts()
        res.status(200).json(response)
    }

    async returnUserAccountByEmail(req: Request, res: Response) {
        const response = await userService.returnUserAccountByEmail(req.params.email)
        res.status(200).json(response)
    }

    async createUser(req: Request, res: Response) {
        await userService.createUser(req.body)
        return res.status(201).json("Usuário cadastrado com sucesso!")
    }

    async updateUserEmail(req: Request, res: Response) {
        const originalEmail = req.params.email
        const { email } = req.body 

        await userService.updateUserEmail(originalEmail, email)
        return res.status(200).json("Email Alterado com sucesso!")
    } 

    async updateUserPassword(req: Request, res: Response) {
        const email = req.params.email
        const { password } = req.body 

        await userService.updateUserPassword(email, password)
        return res.status(200).json("Senha Alterada com sucesso!")
    } 

    async deleteAccount(req: Request, res: Response) {
        const email = req.params.email
    
        await userService.deleteAccount(email)
        return res.status(200).json("Sua conta foi deletada com sucesso")
    } 
}