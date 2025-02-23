import express from 'express';

export const mainRouter = express.Router();
import {userRouter} from './user.js';
import {adminRouter} from './admin.js';

mainRouter.use('/user',userRouter);
mainRouter.use('/admin',adminRouter);

