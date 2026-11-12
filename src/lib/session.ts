import { headers } from "next/headers";
import { auth } from "@/lib/auth";
export async function getCurrentUser(){const session=await auth.api.getSession({headers:await headers()});if(!session?.user)return null;return {...session.user,role:(session.user as typeof session.user & {role?:string}).role??"COMPRADOR"};}
