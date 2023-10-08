import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_LISTING_EXPERIENCE_LEVELS, JOB_LISTING_TYPES } from "@backend/constants/types";
import { Control, FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { JobListingFormValues } from "../hooks/useJobListingFilterForm";

type JobListingFilterFormPropsType = {
  className?: string;
  form: UseFormReturn<JobListingFormValues>;
};

export function JobListingFilterForm({ className, form }: JobListingFilterFormPropsType) {
  return (
    <Form {...form}>
      <form
        className={className}
        onSubmit={(e) => e.preventDefault()}
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
                    {...field}
                    type="text"
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
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*//? Salary */}
          <FormField
            control={form.control}
            name="minimumSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    value={isNaN(field.value) ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*//? Job Type */}
          <JobListingSelectFormField
            control={form.control}
            label="Job Type"
            name="type"
            options={JOB_LISTING_TYPES}
          />

          {/*//? Experience */}
          <JobListingSelectFormField
            control={form.control}
            label="Experience Level"
            name="experienceLevel"
            options={JOB_LISTING_EXPERIENCE_LEVELS}
          />

          {/*//? Checkboxes Grid */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col justify-end gap-4">
              {/*//? Hidden */}
              <FormField
                control={form.control}
                name="showHidden"
                render={({ field }) => (
                  <FormItem className="flex gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked === "indeterminate" ? false : checked);
                        }}
                      />
                    </FormControl>
                    <FormLabel>Show Hidden</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*//? Favorite */}
              <FormField
                control={form.control}
                name="onlyShowFavorites"
                render={({ field }) => (
                  <FormItem className="flex gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked === "indeterminate" ? false : checked);
                        }}
                      />
                    </FormControl>
                    <FormLabel>Only Show Favorites</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
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
                <SelectItem
                  className="cursor-pointer"
                  value=""
                >
                  Any
                </SelectItem>
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
