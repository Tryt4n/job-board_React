import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Await, useDeferredLoaderData } from "@/lib/reactRouter";
import { Link } from "react-router-dom";
import { loader } from "./loader";
import { Suspense } from "react";
import { JobListingSkeletonGrid, MyJobListingGrid } from "@/features/job-listing";

export function MyJobListingsPage() {
  const { jobListingsPromise } = useDeferredLoaderData<typeof loader>();

  return (
    <>
      <PageHeader
        btnSection={
          <Button
            variant={"outline"}
            asChild
          >
            <Link to={"/jobs/new"}>Create Listing</Link>
          </Button>
        }
      >
        My Job Listings
      </PageHeader>

      <Suspense fallback={<JobListingSkeletonGrid />}>
        <Await resolve={jobListingsPromise}>
          {(jobListings) => <MyJobListingGrid jobListings={jobListings} />}
        </Await>
      </Suspense>
    </>
  );
}
