import { JOB_LISTING_EXPERIENCE_LEVELS, JOB_LISTING_TYPES } from "@backend/constants/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { JobListing } from "../constants/types";

const jobListingFilterSchema = z.object({
  title: z.string(),
  location: z.string(),
  minimumSalary: z.number().or(z.nan()),
  type: z.enum(JOB_LISTING_TYPES).or(z.literal("")),
  experienceLevel: z.enum(JOB_LISTING_EXPERIENCE_LEVELS).or(z.literal("")),
  showHidden: z.boolean(),
  onlyShowFavorites: z.boolean(),
});

export type JobListingFormValues = z.infer<typeof jobListingFilterSchema>;

export function useJobListingFilterForm() {
  const form = useForm<JobListingFormValues>({
    resolver: zodResolver(jobListingFilterSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      experienceLevel: "",
      location: "",
      minimumSalary: 0,
      onlyShowFavorites: false,
      showHidden: false,
      type: "",
    },
  });

  const formValues = form.watch();

  function getFilteredJobs(jobListings: JobListing[], hiddenIds: string[], favoriteIds: string[]) {
    return jobListings.filter((jobListing) => {
      if (!jobListing.title.toLocaleLowerCase().match(formValues.title.toLocaleLowerCase())) {
        return false;
      }

      if (!jobListing.location.toLocaleLowerCase().match(formValues.location.toLocaleLowerCase())) {
        return false;
      }

      if (!isNaN(formValues.minimumSalary) && jobListing.salary < formValues.minimumSalary) {
        return false;
      }

      if (formValues.type !== "" && jobListing.type !== formValues.type) {
        return false;
      }

      if (
        formValues.experienceLevel !== "" &&
        jobListing.experienceLevel !== formValues.experienceLevel
      ) {
        return false;
      }

      if (!formValues.showHidden && hiddenIds.includes(jobListing.id)) {
        return false;
      }

      if (formValues.onlyShowFavorites && favoriteIds.includes(jobListing.id)) {
        return false;
      }

      return true;
    });
  }

  return { form, getFilteredJobs };
}
