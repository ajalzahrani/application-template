import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getEmployees } from "@/actions/employees";
import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { EmployeeList } from "./components/employee-list";
import { PlusCircle } from "lucide-react";
import { checkServerPermission } from "@/lib/server-permissions";
import { notFound } from "next/navigation";
export default async function PersonsPage() {
  await checkServerPermission("manage:persons");

  const employees = await getEmployees();

  if (!employees.success) {
    return notFound();
  }

  return (
    <PageShell>
      <PageHeader heading="Employees" text="Manage and track employees">
        <Link href="/employees/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Employee
          </Button>
        </Link>
      </PageHeader>

      <EmployeeList employees={employees.employees || []} />
    </PageShell>
  );
}
