import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Entertainment from "./Entertainment";

export async function EntertainmentData() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();


  return (<Entertainment isUserAuthenticated={isUserAuthenticated} />);
}


export default EntertainmentData();