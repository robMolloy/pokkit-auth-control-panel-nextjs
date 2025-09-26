import { MainLayout } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";

export default function Home() {
  return (
    <MainLayout>
      <H1>Welcome to pokkit auth control panel</H1>
      <br />
      <p>
        Pokkit Auth is an opinionated wrapper around PocketBase functionality that builds on the
        solid work the PocketBase maintainers have done. By stripping out non-authentication
        features, Pokkit Auth shows how accessible and powerful PocketBase can be when tailored to
        standard development workflows.
      </p>
      <br />
      <p>
        Pokkit Auth is an opinionated wrapper around PocketBase functionality that builds on the
        solid work the PocketBase maintainers have done. By stripping out non-authentication
        features, Pokkit Auth shows how accessible and powerful PocketBase can be when focused on
        standard development workflows.
      </p>
      <br />
      <p>
        This project continues PocketBase's approach of providing a genuinely open source solution
        that keeps control with developers. Building on PocketBase's strong foundation, we can offer
        something that's easy to use and maintain, without paid subscriptions or dependence on big
        companies that might change their pricing. The maintainers have made it possible to get up
        and running quickly without the trade-offs you see in some open-source alternatives.
      </p>
      <br />
      <p>
        Most importantly, Pokkit Auth is designed to help the maintainers by handling UI-related
        requests, letting them focus on the core functionality that makes PocketBase great. This
        respects what they're already doing well and supports their work on the project.
      </p>

      <p>
        At this time we are working on Pokkit Auth "core". This merely exposes existing pocketbase
        functionality, but we would like to add more features and functionality over time. The
        roadmap includes:
      </p>
      <br />
      <p className="ml-6">
        &bull; RBAC <br />
        &bull; Organisations <br />
        &bull; Payments <br />
        &bull; User control other devices <br />
      </p>
      <br />
      <p>For any additional ideas or suggestions, please post on the github discussions.</p>
    </MainLayout>
  );
}
