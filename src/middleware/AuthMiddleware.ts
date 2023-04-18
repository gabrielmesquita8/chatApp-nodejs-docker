import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../middleware//errors/ApiErrors'
import { UserService } from "../service/UserService";
import jwt from 'jsonwebtoken'
require('dotenv').config();

type JwtPayload = {
	id: number
}

const userService = new UserService()

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { authorization } = req.headers

	if (!authorization) {
		throw new UnauthorizedError('Não autorizado')
	}

	const token = authorization.split(' ')[1]

	const { id } = jwt.verify(token, process.env.JWT_PASSWORD ?? '') as JwtPayload

	const user = await userService.returnUserAccountById(id)

	if (!user) {
		throw new UnauthorizedError('Não autorizado')
	}

	next()
}