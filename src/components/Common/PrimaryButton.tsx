import { ReactNode } from "react";

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
      className={`text-white font-bold py-2 px-4 rounded ${buttonColor} ${
        disabled ? "cursor-not-allowed" : `pointer ${hoverButtonColor}`
      }`}
      onClick={handleClickMethod}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
