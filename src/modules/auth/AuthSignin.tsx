import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb } from "@/config/pocketbaseConfig";
import { useState } from "react";
import { superuserLogin } from "../superusers/dbSuperusersUtils";

export function AuthSignin() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const resp = await superuserLogin({ pb, username, password });
        console.log(`AuthSignin.tsx:${/*LL*/ 47}`, resp);

        setIsLoading(false);
      }}
    >
      <div>
        <Label>SuperUser username</Label>
        <TextInput value={username} onInput={(x) => setUsername(x)} placeholder="admin@admin.com" />
      </div>
      <div>
        <Label>SuperUser password</Label>
        <TextInput
          type="password"
          value={password}
          onInput={(x) => setPassword(x)}
          placeholder="Password"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </div>
    </form>
  );
}
