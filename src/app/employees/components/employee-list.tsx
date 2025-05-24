"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { deactivateEmployee } from "@/actions/employees";
import { Prisma } from "@prisma/client";

type EmployeeWithJobTitle = Prisma.EmployeeGetPayload<{
  include: {
    nationality: true;
    jobTitle: true;
  };
}>;

export function EmployeeList({
  employees,
}: {
  employees: EmployeeWithJobTitle[];
}) {
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeWithJobTitle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deactivateEmployee(employeeToDelete.id || "");
      if (result.success) {
        toast({
          title: "Success",
          description: `Employee '${employeeToDelete.firstName} ${employeeToDelete.lastName}' has been deactivated`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to deactivate employee",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deactivating the employee",
      });
      console.error(err);
    } finally {
      setIsDeleting(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Status</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      {employee.firstName} {employee?.secondName}{" "}
                      {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.jobTitle?.nameEn}</TableCell>
                    <TableCell>{employee.dob?.toDateString()}</TableCell>
                    <TableCell>
                      {employee.isActive ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Link href={`/employees/${employee.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Link href={`/employees/${employee.id}/edit`}>
                          <FileEdit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEmployeeToDelete(employee)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!employeeToDelete}
        onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the employee &quot;
              {employeeToDelete?.firstName} {employeeToDelete?.lastName}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEmployeeToDelete(null)}
              disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee}
              disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
