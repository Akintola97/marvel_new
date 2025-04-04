import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Comics from "./Comics";
import SavedItems from "./Saved";

export async function SavedData() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();


  return (<SavedItems isUserAuthenticated={isUserAuthenticated} />);
}


export default SavedData();