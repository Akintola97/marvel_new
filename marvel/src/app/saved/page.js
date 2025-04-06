// import { SavedData } from "@/components/SavedData";

// export default function Saved() {
//   return (
//     <>
//      <SavedData />
//     </>
//   );
// }


import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SavedItemsAestheticWithModal from "@/components/Saved";

export default async function SavedPage() {
  const { isAuthenticated } = getKindeServerSession();
  const auth = await isAuthenticated();

  // If not authenticated, redirect to login.
  if (!auth) {
    redirect("/");
  }

  // Render the protected component if authenticated.
  return <SavedItemsAestheticWithModal isUserAuthenticated={auth} />;
}
