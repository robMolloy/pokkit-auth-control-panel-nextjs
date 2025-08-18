import { MainLayout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1 } from "@/components/ui/defaultComponents";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePocketBaseStore, usePocketBaseUrlStore } from "@/stores/pocketBaseStore";
import { useState } from "react";

const PocketBaseConnectToInstanceForm = () => {
  const pocketBaseStore = usePocketBaseStore();
  const pocketBaseUrlStore = usePocketBaseUrlStore();
  const [url, setUrl] = useState("http://127.0.0.1:8090");

  const status = (() => {
    const data = pocketBaseStore.data;
    if (data === null) return "disconnected";
    if (data === undefined) return "loading";
    return "connected";
  })();

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

            pocketBaseUrlStore.setData(url);
          }}
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
            <Button type="submit" disabled={status === "loading"}>
              Submit
            </Button>
          </div>
          <pre>{JSON.stringify({ pocketBaseUrlStore }, undefined, 2)}</pre>
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
          <PocketBaseConnectToInstanceForm />
        </div>
      </div>
    </MainLayout>
  );
};
