import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1 } from "@/components/ui/defaultComponents";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { checkPocketBaseUrlHealth } from "../pocketBaseHelpers";
import { MainLayout } from "@/components/layout/LayoutTemplate";
import { usePocketBaseStore } from "../pocketBaseStore";

const PocketBaseConnectToInstanceForm = () => {
  const pocketBaseStore = usePocketBaseStore();
  const [url, setUrl] = useState("http://127.0.0.1:8090");
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
            const resp = await checkPocketBaseUrlHealth(url);
            pocketBaseStore.setData(resp.success ? resp.data.pb : null);
            setIsLoading(false);
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
            <Button type="submit" disabled={isLoading}>
              Submit
            </Button>
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
          <PocketBaseConnectToInstanceForm />
        </div>
      </div>
    </MainLayout>
  );
};
