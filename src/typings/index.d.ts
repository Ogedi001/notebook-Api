import { Userpayload } from "../helpers/generate-jwtToken";

declare global{
    namespace Express{
        interface Request {
            currentUser?:Userpayload
        }
    }
}