import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PermissionButton } from "@/components/auth/permission-button";
import { checkServerPermission } from "@/lib/server-permissions";
import { getCurrentUserFromDB } from "@/actions/auths";

export default async function NotificationPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const user = await getCurrentUserFromDB(session?.user.id);

  return (
    <PageShell>
      <PageHeader heading="Notification" text="Manage user notification">
        <Link href="/occurrences/new">
          <PermissionButton permission="create:occurrence" asChild>
            <PlusCircle className="mr-2 h-4 w-4" />
            Report Occurrence
          </PermissionButton>
        </Link>
      </PageHeader>
    </PageShell>
  );
}
