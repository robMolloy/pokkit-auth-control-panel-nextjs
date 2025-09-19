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
                href="/app-settings"
                iconName="Settings"
                isHighlighted={router.pathname === "/app-settings"}
              >
                App Settings
              </SidebarButton>
              <SidebarButton
                href="/users"
                iconName="Users"
                isHighlighted={router.pathname === "/users"}
              >
                Users
              </SidebarButton>
              <SidebarButton
                href="/auth-methods"
                iconName="Shield"
                isHighlighted={router.pathname === "/auth-methods"}
              >
                Auth Methods
              </SidebarButton>
              <SidebarButton
                href="/oauth2"
                iconName="Link"
                isHighlighted={router.pathname === "/oauth2"}
              >
                oAuth2
              </SidebarButton>
              <SidebarButton
                href="/email-settings"
                iconName="Mail"
                isHighlighted={router.pathname === "/email-settings"}
              >
                Email Settings
              </SidebarButton>
              <SidebarButton
                href="/email-templates"
                iconName="FileText"
                isHighlighted={router.pathname === "/email-templates"}
              >
                Email Templates
              </SidebarButton>
              <SidebarButton
                href="/tokens"
                iconName="Key"
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
