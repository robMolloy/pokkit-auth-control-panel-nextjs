import { PreserveScrollAbility } from "@/components/layout/LayoutTemplate";
import { LeftSidebarTemplate, SidebarButton } from "@/components/layout/LeftSidebarTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { logout } from "@/modules/auth/dbAuthUtils";
import { useCurrentUserStore } from "@/stores/authDataStore";
import { useRouter } from "next/router";
import { useState } from "react";

export function LeftSidebar() {
  const router = useRouter();
  const [scrollItemIndex, setScrollItemIndex] = useState(0);

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
            </>
          )
        }
        middle={[...Array(100)].map((_, j) => (
          <SidebarButton
            iconName="Ban"
            key={j}
            isHighlighted={j === scrollItemIndex}
            onClick={() => setScrollItemIndex(j)}
          >
            do summit {j} {j === scrollItemIndex && <>(selected)</>}
          </SidebarButton>
        ))}
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
