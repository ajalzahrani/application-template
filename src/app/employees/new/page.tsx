"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, Form, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import {
  employeeSchema,
  type EmployeeFormValues,
} from "@/actions/employees.validation";
import { createEmployee } from "@/actions/employees";
import { ArrowLeft } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getItems } from "@/actions/references";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelType {
  id: string;
  nameEn: string;
  nameAr: string;
}

export default function NewEmployee() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [jobTitles, setJobTitles] = useState<ModelType[]>([]);
  const [units, setUnits] = useState<ModelType[]>([]);
  const [sponsors, setSponsors] = useState<ModelType[]>([]);
  const [nationalities, setNationalities] = useState<ModelType[]>([]);
  const [ranks, setRanks] = useState<ModelType[]>([]);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      secondName: "",
      thirdName: "",
      lastName: "",
      gender: "Male",
      dob: undefined,
      citizenship: "Civilian",
      nationalityId: "",
      noriqama: "",
      mrn: "",
      employeeNo: "",
      unitId: "",
      rankId: "",
      jobTitleId: "",
      sponsorId: "",
      pictureLink: "",
      cardExpiryAt: new Date(),
      lastRenewalAt: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const jobTitles = await getItems("jobTitle");
      setJobTitles(jobTitles.data);
      const units = await getItems("unit");
      setUnits(units.data);
      const sponsors = await getItems("sponsor");
      setSponsors(sponsors.data);
      const nationalities = await getItems("nationality");
      setNationalities(nationalities.data);
      const ranks = await getItems("rank");
      setRanks(ranks.data);
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    getValues,
    watch,
  } = form;

  const citizenship = watch("citizenship");

  const onSubmit: SubmitHandler<EmployeeFormValues> = async (data) => {
    setIsSubmitting(true);

    try {
      // Get the file from the form
      const form = document.querySelector("form");
      const fileInput = form?.querySelector(
        "input[type=file]"
      ) as HTMLInputElement;

      // Create a FormData object
      const formData = new FormData();

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append the file if it exists
      if (fileInput?.files?.[0]) {
        formData.append("file", fileInput.files[0]);
      }

      console.log("Submitting form data...", formData);
      const result = await createEmployee(formData);
      console.log("Submission result:", result);

      if (result.success) {
        toast({
          title: "Employee created successfully",
        });
        router.push("/employees");
      } else {
        toast({
          title: "Failed to create employee",
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast({
        title: "Failed to create employee",
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <PageShell>
      <PageHeader heading="Employee Registration" text="Create a new employee">
        <Button variant="outline" asChild>
          <Link href="/employees">
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
      </PageHeader>
      <form
        onSubmit={handleSubmit(
          (data) => {
            console.log("Form submitted with data:", data);
            return onSubmit(data);
          },
          (errors) => {
            console.log("Form validation errors:", errors);
          }
        )}
        className="flex flex-row space-x-6 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Picture</CardTitle>
            <CardDescription>Upload a picture of the person</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={previewUrl || "/avatar.png"}
                  alt={`${getValues("firstName")} ${getValues("lastName")}`}
                />
                <AvatarFallback className="text-2xl bg-gray-200 text-gray-600">
                  {getInitials(
                    getValues("firstName") || "",
                    getValues("lastName") || ""
                  )}
                </AvatarFallback>
              </Avatar>

              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Person Details</CardTitle>
            <CardDescription>
              Provide details about the occurrence that occurred
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* First Row */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter first name"
                  className="mt-1"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondName">Second Name</Label>
                <Input
                  id="secondName"
                  {...register("secondName")}
                  placeholder="Enter second name"
                  className="mt-1"
                />
                {errors.secondName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.secondName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thirdName">Third Name</Label>
                <Input
                  id="thirdName"
                  {...register("thirdName")}
                  placeholder="Enter third name"
                  className="mt-1"
                />
                {errors.thirdName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.thirdName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Enter last name"
                  className="mt-1"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Second Row */}
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      date={field.value || new Date()}
                      setDate={field.onChange}
                    />
                  )}
                />
                {errors.dob && (
                  <p className="text-sm text-red-500">{errors.dob.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Controller
                  name="jobTitleId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select job title" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {jobTitles.map((jobTitle) => (
                          <SelectItem key={jobTitle.id} value={jobTitle.id}>
                            {jobTitle.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.jobTitleId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.jobTitleId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenship">Citizenship</Label>
                <Controller
                  name="citizenship"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select citizenship" />
                      </SelectTrigger>
                      <SelectContent className="">
                        <SelectItem value="Civilian">Civilian</SelectItem>
                        <SelectItem value="Foreigner">Foreigner</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.citizenship && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.citizenship.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="noriqama">National / Iqama Number</Label>
                <Input
                  id="noriqama"
                  {...register("noriqama")}
                  placeholder="Enter national/iqama number"
                  className="mt-1"
                />
                {errors.noriqama && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.noriqama.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Controller
                  name="nationalityId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalities.map((nationality) => (
                          <SelectItem
                            key={nationality.id}
                            value={nationality.id}>
                            {nationality.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.nationalityId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nationalityId.message}
                  </p>
                )}
              </div>

              {citizenship === "Foreigner" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="sponsor">Sponsor</Label>
                    <Controller
                      name="sponsorId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sponsor" />
                          </SelectTrigger>
                          <SelectContent>
                            {sponsors.map((sponsor) => (
                              <SelectItem key={sponsor.id} value={sponsor.id}>
                                {sponsor.nameAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.sponsorId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.sponsorId.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {citizenship === "Other" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mrn">MRN</Label>
                    <Input
                      id="mrn"
                      {...register("mrn")}
                      placeholder="Enter mrn"
                      className="mt-1"
                    />
                    {errors.mrn && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.mrn.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rank">Rank</Label>
                    <Controller
                      name="rankId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select rank" />
                          </SelectTrigger>
                          <SelectContent>
                            {ranks.map((rank) => (
                              <SelectItem key={rank.id} value={rank.id}>
                                {rank.nameAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.rankId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.rankId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Controller
                      name="unitId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit.id} value={unit.id}>
                                {unit.nameAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.unitId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.unitId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeNo">Employee Number</Label>
                    <Input
                      id="employeeNo"
                      {...register("employeeNo")}
                      placeholder="Enter employee number"
                      className="mt-1"
                    />
                    {errors.employeeNo && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.employeeNo.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <div>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="mr-2">
                Cancel
              </Button>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Employee"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageShell>
  );
}
