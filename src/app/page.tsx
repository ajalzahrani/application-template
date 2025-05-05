import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { PlusCircle, LogIn, ShieldAlert } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <main>
        <div className="container mx-auto max-w-screen-xl py-6 md:py-8 px-4">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">
                Application Template
              </h1>
              <p className="text-xl text-muted-foreground">
                Clone this template to create your own application
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-8 py-8">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>Form Submission</CardTitle>
                  <CardDescription>
                    Example form submission page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Use form submission page to submit form data to the database
                  </p>
                  <Link href="/form-submission">
                    <Button className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Form Submission
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Registered User Access</CardTitle>
                  <CardDescription>
                    Sign in to access additional features and track your reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Sign in to your account to access the full features of the
                    application.
                  </p>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About the OVA System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This template is designed to help get you started with your
                  own application. It is a simple and easy to use template that
                  you can clone and use to create your own application.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="font-medium">Main Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Role based access control
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Additional Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Your own database, your own application
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Secure & Confidential</h3>
                    <p className="text-sm text-muted-foreground">
                      Modern tech stack, modern design
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto max-w-screen-xl flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0 px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Application Template. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
