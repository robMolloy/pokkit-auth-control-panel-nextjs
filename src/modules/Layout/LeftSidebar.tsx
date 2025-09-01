import { PreserveScrollAbility } from "@/components/layout/LayoutTemplate";
import { LeftSidebarTemplate, SidebarButton } from "@/components/layout/LeftSidebarTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { logout } from "@/modules/auth/dbAuthUtils";
import { useCurrentUserStore } from "@/stores/authDataStore";
import { useRouter } from "next/router";

export function LeftSidebar() {
  const router = useRouter();

  const currentUserStore = useCurrentUserStore();

  const isApproved = currentUserStore.data.authStatus === "loggedIn";

  return (
    <PreserveScrollAbility className="w-64">
      <LeftSidebarTemplate
        top={
          isApproved && (
            <>
              <SidebarButton href="/" iconName="Home" isHighlighted={router.pathname === "/"}>
                Home
              </SidebarButton>
              <SidebarButton
                href="/oauth2"
                iconName="Home"
                isHighlighted={router.pathname === "/oauth2"}
              >
                oAuth2
              </SidebarButton>
              <SidebarButton
                href="/email"
                iconName="Home"
                isHighlighted={router.pathname === "/email"}
              >
                Email
              </SidebarButton>
              <SidebarButton
                href="/tokens"
                iconName="Home"
                isHighlighted={router.pathname === "/tokens"}
              >
                Tokens
              </SidebarButton>
            </>
          )
        }
        bottom={
          currentUserStore.data.authStatus === "loggedIn" && (
            <>
              <SidebarButton iconName="LogOut" isHighlighted={false} onClick={() => logout({ pb })}>
                Log Out
              </SidebarButton>
            </>
          )
        }
      />
    </PreserveScrollAbility>
  );
}
