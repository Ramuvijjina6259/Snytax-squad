import TeamShowcase from "@/components/ui/team-showcase";
import { BackgroundPaths } from "@/components/ui/background-paths"

export default function TeamShowcaseDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <TeamShowcase />
    </div>
  );
}

export function DemoBackgroundPaths() {
    return <BackgroundPaths title="Background Paths" />
}
