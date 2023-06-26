import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'
import { AuthGuard } from '../middlewares/jwtAuthGuard'

const router = Router()

router.get('/logged-in-devices', AuthGuard, AuthController.getLoggedInDevices)
router.get('/refresh-token', AuthController.refreshToken)
router.post('/sign-in', AuthController.login)
router.post('/sign-up', AuthController.register)
router.post('/verify-account', AuthGuard, AuthController.verifyAccount)
router.delete('/sign-out', AuthGuard, AuthController.logout)

export default router