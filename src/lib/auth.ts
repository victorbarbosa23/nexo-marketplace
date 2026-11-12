import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
export const auth = betterAuth({
  appName:"Nexo",
  baseURL:process.env.BETTER_AUTH_URL,
  secret:process.env.BETTER_AUTH_SECRET,
  database:prismaAdapter(prisma,{provider:"postgresql"}),
  emailAndPassword:{enabled:true,minPasswordLength:8,maxPasswordLength:128},
  user:{additionalFields:{role:{type:"string",required:false,defaultValue:"COMPRADOR",input:false}}}
});
