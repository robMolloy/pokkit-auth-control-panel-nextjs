import { PreserveScrollAbility } from "@/components/layout/LayoutTemplate";
import { LeftSidebarTemplate, SidebarButton } from "@/components/layout/LeftSidebarTemplate";
import { useRouter } from "next/router";
import { useState } from "react";
import { usePocketBaseStore } from "../pocketBase/pocketBaseStore";
import { useSuperUserAuthStore } from "../superUserAuth/useSuperUserAuthStore";

export function LeftSidebar() {
  const pocketBaseStore = usePocketBaseStore();
  const superUserAuthStore = useSuperUserAuthStore();
  const router = useRouter();
  const [scrollItemIndex, setScrollItemIndex] = useState(0);

  return !pocketBaseStore.data ? (
    <></>
  ) : (
    <PreserveScrollAbility className="w-64">
      <LeftSidebarTemplate
        top={
          pocketBaseStore.data && (
            <>
              <SidebarButton href="/" iconName="Home" isHighlighted={router.pathname === "/"}>
                Home
              </SidebarButton>
              <SidebarButton
                href="/scroll"
                iconName="Ban"
                isHighlighted={router.pathname === "/scroll"}
              >
                Scroll
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
          pocketBaseStore.data && (
            <>
              {superUserAuthStore.data && (
                <SidebarButton
                  iconName="LogOut"
                  isHighlighted={false}
                  onClick={() => pocketBaseStore.logout()}
                >
                  Log Out
                </SidebarButton>
              )}
              <SidebarButton
                iconName="Unplug"
                isHighlighted={false}
                onClick={() => pocketBaseStore.clear()}
              >
                Disconnect
              </SidebarButton>
            </>
          )
        }
      />
    </PreserveScrollAbility>
  );
}
