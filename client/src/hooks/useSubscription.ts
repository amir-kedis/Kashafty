import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import {
  useGetSectorSubscriptionQuery,
  useInsertSubscriptionMutation,
} from "../redux/slices/financeApiSlice";

export const useSubscriptipn = (chosenWeek, termNumber) => {
  const [subscription, setSubscription] = useState<number>(0);

  const userInfo: { rSectorBaseName: string; rSectorSuffixName: string } =
    useAuthUser();

  const baseName = userInfo?.rSectorBaseName;
  const suffixName = userInfo?.rSectorSuffixName;

  let { data, isSuccess, isError } = useGetSectorSubscriptionQuery(
    {
      weekNumber: chosenWeek,
      sectorBaseName: baseName,
      sectorSuffixName: suffixName,
    },
    { refetchOnMountOrArgChange: true, skip: !chosenWeek }
  );

  const [insert, { isLoading: isLoadingInsertSubscription }] =
    useInsertSubscriptionMutation();

  useEffect(() => {
    if (isSuccess && !isError && data?.body) setSubscription(data?.body);
    else setSubscription(0);
  }, [data, isSuccess]);

  async function insertSubsrition() {
    const subscriptionReqBody = {
      value: subscription,
      weekNumber: parseInt(chosenWeek),
      termNumber,
      sectorBaseName: baseName,
      sectorSuffixName: suffixName,
    };

    console.log({ subscriptionReqBody });

    try {
      const res = await insert(subscriptionReqBody).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error(
          "Something went wrong while inserting the subscription"
        );
      toast.success("تم تسجيل الاشتراك بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء تسجيل الاشتراك");
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
    }
  }

  return {
    subscription,
    setSubscription,
    insertSubsrition,
    isLoadingInsertSubscription,
  };
};
