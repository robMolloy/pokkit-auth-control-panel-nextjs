import { MainLayout } from "@/components/layout/LayoutTemplate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1 } from "@/components/ui/defaultComponents";
import { TextInput } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { PocketBase } from "../pocketBase/pocketBaseHelpers";
import { useSuperUserAuthStore } from "./useSuperUserAuthStore";
import { Button } from "@/components/ui/button";
import { superUserLogin } from "./dbSuperUserHelpers";

export const SuperUserAuthForm = (p: { pb: PocketBase }) => {
  const superUserAuthStore = useSuperUserAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card>
      <CardHeader>
        <H1>PocketBase Instance</H1>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();

            setIsLoading(true);

            const resp = await superUserLogin({ pb: p.pb, username, password });
            if (resp.success) superUserAuthStore.setData(resp.data);

            setIsLoading(false);
          }}
        >
          <div>
            <Label>Superuser username</Label>
            <TextInput
              value={username}
              onInput={(x) => setUsername(x)}
              placeholder="admin@admin.com"
            />
          </div>
          <div>
            <Label>Superuser password</Label>
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

export const SuperUserAuthScreen = (p: { pb: PocketBase }) => {
  return (
    <MainLayout>
      <div className="mt-16 flex justify-center">
        <div className="w-[400px]">
          <SuperUserAuthForm pb={p.pb} />
        </div>
      </div>
    </MainLayout>
  );
};
