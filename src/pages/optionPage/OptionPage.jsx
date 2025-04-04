// OptionPage.js
import React, { useEffect, useState } from "react";
import OptionForm from "../../components/OptionForm/OptionForm";
import OptionFormMaster from "../../components/OptionForm/OptionFormMaster";
import { useSelector } from "react-redux";
import PeriodNotOpen from "../../components/periodComponents/PeriodNotOpen";
import OptionAlready from "../../components/OptionForm/OptionAlready";
import {
  checkOptionstudent,
  checkOptionperiod,
} from "../../services/OptionServices/option.service";

export default function OptionPage() {
  const user = useSelector((state) => state.auth?.user);
  const level = user?.level;
  const isMaster = user?.isMaster;
  const userId = user?.id;
  const [status, setStatus] = useState({
    loading: true,
    errorType: null, // 'period-closed' | 'choice-made'
  });

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const periodResponse = await checkOptionperiod();
        if (periodResponse.answer === false) {
          setStatus({ loading: false, errorType: "period-closed" });
          return;
        }
        const optionResponse = await checkOptionstudent(userId);
        if (optionResponse.answer === true) {
          setStatus({ loading: false, errorType: "choice-made" });
        } else {
          setStatus({ loading: false, errorType: null });
        }
      } catch (error) {
        console.error("Error checking eligibility:", error);
        setStatus({ loading: false, errorType: "choice-made" });
      }
    };

    if (userId) {
      checkEligibility();
    }
  }, [userId]);

  if (status.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow rounded text-center">
          <p>Checking your eligibility...</p>
        </div>
      </div>
    );
  }

  if (status.errorType === "period-closed") {
    return <PeriodNotOpen />;
  }

  if (status.errorType === "choice-made") {
    return <OptionAlready />;
  }

  if (level === "2year" && isMaster === true) {
    return <OptionFormMaster />;
  }

  if (level === "2year") {
    return <OptionForm />;
  }

  return null;
}
