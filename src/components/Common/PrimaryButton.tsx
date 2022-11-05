import { ReactNode } from "react";
import tw from "twin.macro";

type Props = {
  buttonColor: string;
  children: ReactNode;
  disabled: boolean;
  handleClickMethod: () => void;
  hoverButtonColor: string;
};

export const PrimaryButton = (props: Props) => {
  const { buttonColor, children, disabled, handleClickMethod, hoverButtonColor } = props;

  return (
    <button
      className={`${buttonColor} ${disabled ? "cursor-not-allowed" : hoverButtonColor}`}
      tw="text-white font-bold py-2 px-4 rounded"
      onClick={handleClickMethod}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
