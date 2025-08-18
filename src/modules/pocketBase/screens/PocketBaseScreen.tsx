import { MainLayout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1 } from "@/components/ui/defaultComponents";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePocketBaseStore } from "@/stores/pocketBaseStore";
import { useState } from "react";
import { z } from "zod";
import { PocketBase } from "../pocketBaseHelpers";

const checkPocketBaseUrlHealth = async (url: string) => {
  const schema = z.object({ status: z.number() });
  try {
    const initResp = await fetch(`${url}/api/health`);
    return schema.safeParse(initResp);
  } catch (error) {
    return { success: false, error } as const;
  }
};

const PocketBaseInstanceConnectForm = () => {
  const pocketBaseStore = usePocketBaseStore();
  const [url, setUrl] = useState("");
  return (
    <Card>
      <CardHeader>
        <H1>PocketBase Instance</H1>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const x = await checkPocketBaseUrlHealth(url);
            if (x.success) pocketBaseStore.setData(new PocketBase(url));
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <Label>Connect to your PocketBase instance</Label>
            <TextInput
              value={url}
              onInput={(x) => setUrl(x)}
              placeholder="https://your-pocketbase-instance.com"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const PocketBaseScreen = () => {
  return (
    <MainLayout>
      <div className="mt-16 flex justify-center">
        <div className="w-[400px]">
          <PocketBaseInstanceConnectForm />
        </div>
      </div>
    </MainLayout>
  );
};
