import { MainLayout } from "@/components/layout/LayoutTemplate";

import { SuperUserAuthForm } from "./SuperuserAuthSigninForm";
import { PocketBase } from "@/config/pocketbaseConfig";

export const SuperuserAuthScreen = (p: { pb: PocketBase }) => {
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
