import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  plugins: [adminClient()],
});

console.log(Object.keys(authClient));
