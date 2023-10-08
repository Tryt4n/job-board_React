import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import {
  JobListingCard,
  JobListingFilterForm,
  JobListingFullDialog,
  JobListingGrid,
  JobListingSkeletonGrid,
  useJobListingFilterForm,
} from "@/features/job-listing";
import { Await, useDeferredLoaderData } from "@/lib/reactRouter";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import { loader } from "./loader";
import { Eye, EyeOff, Heart } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/utils/shadcnUtils";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function JobListingsListPage() {
  const { jobListingsPromise } = useDeferredLoaderData<typeof loader>();
  const [hiddenJobListingsIds, setHiddenJobListingsIds] = useLocalStorage<string[]>(
    "hiddenJobsIds",
    []
  );
  const [favoriteJobListingsIds, setFavoriteJobListingsIds] = useLocalStorage<string[]>(
    "favoriteJobsIds",
    []
  );
  const { form, getFilteredJobs } = useJobListingFilterForm();

  function toggleFavorite(jobListingId: string) {
    setFavoriteJobListingsIds((ids) => {
      if (ids.includes(jobListingId)) {
        return ids.filter((id) => id != jobListingId);
      }

      return [...ids, jobListingId];
    });
  }

  function toggleHide(jobListingId: string, title: string) {
    setHiddenJobListingsIds((ids) => {
      if (ids.includes(jobListingId)) {
        return ids.filter((id) => id !== jobListingId);
      }

      return [...ids, jobListingId];
    });

    if (hiddenJobListingsIds.includes(jobListingId)) return;
    toast({
      title: "Job Hidden",
      description: `${title} will no longer be shown.`,
      action: (
        <ToastAction
          onClick={() => {
            setHiddenJobListingsIds((ids) => ids.filter((id) => id !== jobListingId));
          }}
          altText="Click show hidden in the filter section to show hidden jobs and then click the show button in the card to show this job again."
        >
          Undo
        </ToastAction>
      ),
    });
  }

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
        Job Listings
      </PageHeader>

      <JobListingFilterForm
        className={"mb-12"}
        form={form}
      />

      <Suspense fallback={<JobListingSkeletonGrid />}>
        <Await resolve={jobListingsPromise}>
          {(jobListings) => (
            <JobListingGrid>
              {getFilteredJobs(jobListings, hiddenJobListingsIds, favoriteJobListingsIds).map(
                (jobListing) => {
                  const isFavorite = favoriteJobListingsIds.includes(jobListing.id);
                  const isHidden = hiddenJobListingsIds.includes(jobListing.id);
                  const HideIcon = isHidden ? Eye : EyeOff;

                  return (
                    <JobListingCard
                      key={jobListing.id}
                      className={`transition${isHidden ? " opacity-50" : undefined}`}
                      {...jobListing}
                      headerDetails={
                        <div className="-mr-3 -mt-3">
                          <Button
                            size={"icon"}
                            variant={"ghost"}
                            className="rounded-full"
                            onClick={() => toggleHide(jobListing.id, jobListing.title)}
                          >
                            <HideIcon className="w-4 h-4" />
                            <div className="sr-only">{isHidden ? "Show" : "Hide"}</div>
                          </Button>
                          <Button
                            size={"icon"}
                            variant={"ghost"}
                            className="rounded-full"
                            onClick={() => toggleFavorite(jobListing.id)}
                          >
                            <Heart
                              className={cn(
                                "w-4 h-4",
                                isFavorite && "fill-red-500 stroke-red-500 transition-all"
                              )}
                            />
                            <div className="sr-only">{isFavorite ? "Un-Favorite" : "Favorite"}</div>
                          </Button>
                        </div>
                      }
                      footerBtns={<JobListingFullDialog {...jobListing} />}
                    />
                  );
                }
              )}
            </JobListingGrid>
          )}
        </Await>
      </Suspense>
    </>
  );
}
