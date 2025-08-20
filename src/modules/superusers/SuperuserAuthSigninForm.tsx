import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1 } from "@/components/ui/defaultComponents";
import { TextInput } from "@/components/ui/input";
import { PocketBase } from "@/config/pocketbaseConfig";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { superuserLogin } from "./dbSuperusersUtils";

export const SuperUserAuthForm = (p: { pb: PocketBase }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card>
      <CardHeader>
        <H1>SuperUser Sign In</H1>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();

            setIsLoading(true);

            await superuserLogin({ pb: p.pb, username, password });

            setIsLoading(false);
          }}
        >
          <div>
            <Label>SuperUser username</Label>
            <TextInput
              value={username}
              onInput={(x) => setUsername(x)}
              placeholder="admin@admin.com"
            />
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
      </CardContent>
    </Card>
  );
};
