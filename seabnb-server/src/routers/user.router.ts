import { Router } from 'express'
import * as UserController from '../controllers/user.controller'
import { AuthGuard } from '../middlewares/jwtAuthGuard'

const router = Router()

router.get('/user-info', AuthGuard, UserController.getUserInfo)

export default router