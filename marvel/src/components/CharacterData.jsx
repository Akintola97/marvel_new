import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Characters from "./Characters";

export async function CharacterData() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();


  return (<Characters isUserAuthenticated={isUserAuthenticated} />);
}


export default CharacterData();