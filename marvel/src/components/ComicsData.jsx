import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Comics from "./Comics";

export async function ComicsData() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();


  return (<Comics isUserAuthenticated={isUserAuthenticated} />);
}


export default ComicsData();