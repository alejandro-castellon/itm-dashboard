import { Check, CircleX } from "lucide-react";
import clsx from "clsx";

export default function AutoclaveStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-red-100 text-gray-500": status === "Falla",
          "bg-green-500 text-white": status === "Correcto",
        }
      )}
    >
      {status === "Falla" ? (
        <>
          Falla
          <CircleX className="ml-1 w-4 text-red-500" />
        </>
      ) : null}
      {status === "Correcto" ? (
        <>
          Correcto
          <Check className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
