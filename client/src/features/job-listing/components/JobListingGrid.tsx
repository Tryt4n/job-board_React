import { cn } from "@/utils/shadcnUtils";
import { ComponentProps } from "react";

type JobListingGridPropsType = ComponentProps<"div">;

export function JobListingGrid({ className, ...props }: JobListingGridPropsType) {
  return (
    <div
      {...props}
      //   Any className overwrite default classes
      className={cn(
        "flex flex-col sm:grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]",
        className
      )}
    ></div>
  );
}
