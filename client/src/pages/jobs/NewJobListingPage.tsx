import { PageHeader } from "@/components/ui/PageHeader";
import { JobListingForm, createJobListing } from "@/features/job-listing";
import { useNavigate } from "react-router-dom";

export function NewJobListingsPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader>New Listings</PageHeader>
      <JobListingForm
        onSubmit={async (values) => {
          await createJobListing(values);
          navigate("/jobs/my-listings");
        }}
      />
    </>
  );
}
