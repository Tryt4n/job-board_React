import { Button } from "@/components/ui/button";
import { JobListing } from "../constants/types";
import { JobListingCard } from "./JobListingCard";
import { JobListingGrid } from "./JobListingGrid";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteListing } from "../services/jobListing";
import { useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

type MyJobListingGridPropsType = {
  jobListings: JobListing[];
};

export function MyJobListingGrid({ jobListings }: MyJobListingGridPropsType) {
  const [deletedJobListingIds, setDeletedJobListingIds] = useState<string[]>([]);
  const visibleJobListings = useMemo(() => {
    return jobListings.filter((jobListing) => !deletedJobListingIds.includes(jobListing.id));
  }, [jobListings, deletedJobListingIds]);

  function deleteJobListing(id: string) {
    deleteListing(id).catch(() => {
      setDeletedJobListingIds((ids) => {
        toast({
          title: "Failed to delete job listing",
          action: (
            <ToastAction
              altText="Click the delete button in the job card to retry"
              onClick={() => deleteJobListing(id)}
            >
              Retry
            </ToastAction>
          ),
        });
        return ids.filter((listingId) => listingId !== id);
      });
    });
    setDeletedJobListingIds((ids) => [...ids, id]);
  }

  return (
    <JobListingGrid>
      {visibleJobListings.map((jobListing) => (
        <MyJobListingCard
          key={jobListing.id}
          jobListing={jobListing}
          deleteJobListing={deleteJobListing}
        />
      ))}
    </JobListingGrid>
  );
}

type MyJobListingCardPropsType = {
  jobListing: JobListing;
  deleteJobListing: (id: string) => void;
};

function MyJobListingCard({ jobListing, deleteJobListing }: MyJobListingCardPropsType) {
  return (
    <JobListingCard
      {...jobListing}
      footerBtns={
        <>
          <DeleteJobListingDialog deleteListing={() => deleteJobListing(jobListing.id)} />
          <Button
            variant={"outline"}
            asChild
          >
            <Link to={`/jobs/${jobListing.id}/edit`}>Edit</Link>
          </Button>
        </>
      }
    />
  );
}

type DeleteJobListingDialogPropsType = {
  deleteListing: () => void;
};

function DeleteJobListingDialog({ deleteListing }: DeleteJobListingDialogPropsType) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"}>Delete</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this job listing?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your job listing and any
            remaining time will not be refunded.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteListing}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
