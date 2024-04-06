import "dotenv/config"
import "express-async-errors";
import express, { Request, Response, NextFunction, Application, urlencoded } from "express";
import { createServer } from "http";
// security middleware
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import { errorHandlerMiddleware, pageNotFound } from "./middleware/index";
import { StatusCodes } from "http-status-codes";
import { applicationRoutes } from "./routes";


const app:Application = express()

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    handler: (_, res) => {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({ errors: [{ message: 'Too many requests, please try again later.' }] })
    },
    validate: { xForwardedForHeader: false }
  
  });
  
  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet())
app.use(limiter)
app.use(cors({
  origin: [
    process.env.FRONTEND_BASE_URL!,
    process.env.DASHBOARD_BASE_URL!,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
  ],
  credentials: true,
})
);


const server = createServer(app)




app.get ('/api/v1', (req:Request,res:Response)=>{
  
    return res.status(StatusCodes.OK).json({ message: "Welcome to Backend Api version 1.0 🔥🔥🔥" })
})

app.use('/api/v1', applicationRoutes)


app.use(errorHandlerMiddleware)

app.use(pageNotFound)

  export  default server 