import { redisClient } from "../utils";
import { verifyJwtToken } from "./generate-jwtToken";


export const blacklistJWTtoken = async(token:any)=>{
  const tokenExpireTime = verifyJwtToken(token).exp as number;
      const currentTimeInSecs = Math.floor(Date.now() / 1000);
      const ttl = tokenExpireTime - currentTimeInSecs;
  
      await redisClient
        .multi()
        .sAdd("jwt-blacklisted-tokens", token)
        .expire("jwt-blacklisted-tokens", ttl)
        .exec();
  
  }

  export const getBlacklistTokens = async()=>{
    const blacklistTokens = await redisClient.sMembers("jwt-blacklisted-tokens");
    return  blacklistTokens
  }

  
export const checkBlacklist = async (token: string) => {
  const blacklistedTokens = await getBlacklistTokens();
  return blacklistedTokens.includes(token);
};
