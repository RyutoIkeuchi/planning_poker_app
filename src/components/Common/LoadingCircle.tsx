import "twin.macro";

export const LoadingCircle = () => {
  return (
    <div tw="flex justify-center mt-10">
      <div tw="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
  );
};
