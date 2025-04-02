import React from "react";
import OptionForm from "../../components/OptionForm/OptionForm";
import OptionFormMaster from "../../components/OptionForm/OptionFormMaster";
import { useSelector } from "react-redux";
export default function OptionPage() {
  const user = useSelector((state) => state.auth?.user);
  const level = user?.level;
  const isMaster = user?.isMaster;
  if (level === "2year" && isMaster === true) {
    return <OptionFormMaster />;
  }
  if (level === "2year") {
    return <OptionForm />;
  }
}
