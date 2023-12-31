import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

type JobListingCheckoutFormPropsType = {
  amount: number;
};

export function JobListingCheckoutForm({ amount }: JobListingCheckoutFormPropsType) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/jobs/order-complete`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit}>
      {errorMessage && (
        <p className="text-red-500 dark:text-red-900 text-sm mb-4">{errorMessage}</p>
      )}
      <PaymentElement />
      <Button
        className="w-full mt-4"
        disabled={isLoading || stripe == null || elements == null}
      >
        Pay {formatCurrency(amount)}
      </Button>
    </form>
  );
}
