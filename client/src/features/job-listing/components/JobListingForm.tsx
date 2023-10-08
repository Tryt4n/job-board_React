import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues, Path, PathValue, useForm } from "react-hook-form";
import { z } from "zod";
import { jobListingFormSchema } from "@backend/constants/schemas/jobListings";
import { Textarea } from "@/components/ui/textarea";
import { JOB_LISTING_EXPERIENCE_LEVELS, JOB_LISTING_TYPES } from "@backend/constants/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { JobListingGrid } from "./JobListingGrid";
import { JobListingCard } from "./JobListingCard";
import { JobListingFullDialog } from "./JobListingFullDialog";

type JobListingValues = z.infer<typeof jobListingFormSchema>;

const DEFAULT_VALUES: JobListingValues = {
  applyUrl: "",
  companyName: "",
  description: "",
  experienceLevel: "Mid-Level",
  location: "",
  salary: NaN,
  shortDescription: "",
  title: "",
  type: "Full Time",
};

type JobListingFormPropsType = {
  onSubmit: (values: JobListingValues) => void;
  initialJobListing?: JobListingValues;
};

export function JobListingForm({
  onSubmit,
  initialJobListing = DEFAULT_VALUES,
}: JobListingFormPropsType) {
  const form = useForm<JobListingValues>({
    resolver: zodResolver(jobListingFormSchema),
    defaultValues: initialJobListing,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const jobListingValues = form.watch();

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/*//? Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*//? Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*//? Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*//? Application URL */}
            <FormField
              control={form.control}
              name="applyUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*//? Type */}
            <JobListingSelectFormField
              label="Type"
              name="type"
              options={JOB_LISTING_TYPES}
              control={form.control}
            />

            {/*//? Experience Level */}
            <JobListingSelectFormField
              label="Experience Level"
              name="experienceLevel"
              options={JOB_LISTING_EXPERIENCE_LEVELS}
              control={form.control}
            />

            {/*//? Salary */}
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      value={isNaN(field.value) ? "" : field.value}
                      min={0}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">In USD</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*//? Short Description */}
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={200}
                    ></Textarea>
                  </FormControl>
                  <FormDescription className="text-xs">Max 200 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*//? Short Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea {...field}></Textarea>
                  </FormControl>
                  <FormDescription className="text-xs">Supports full Markdown</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/*//? Confirmation */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setIsPreviewOpen((p) => !p)}
            >
              {isPreviewOpen ? "Close" : "Show"} Preview
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <LoadingSpinner /> : "Save"}
            </Button>
          </div>
        </form>
      </Form>

      {isPreviewOpen && (
        <JobListingGrid className="mt-12">
          <JobListingCard
            {...jobListingValues}
            footerBtns={<JobListingFullDialog {...jobListingValues} />}
          />
        </JobListingGrid>
      )}
    </>
  );
}

type JobListingSelectFormFieldPropsType<T extends FieldValues> = {
  label: string;
  control: Control<T>;
  name: Path<T>;
  options: readonly PathValue<T, Path<T>>[];
};

function JobListingSelectFormField<T extends FieldValues>({
  label,
  control,
  name,
  options,
}: JobListingSelectFormFieldPropsType<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value as PathValue<T, Path<T>>)}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="cursor-pointer"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
