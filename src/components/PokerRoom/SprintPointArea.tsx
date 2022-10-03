type Props = {
  isSelectNumberResult: boolean;
  selectNumberCardAverage: number;
};

export const SprintPointArea = (props: Props) => {
  const { isSelectNumberResult, selectNumberCardAverage } = props;

  return (
    <div className="mb-10 border-b border-gray-500">
      <div className="text-center pt-10 pb-20">
        <div className="mb-6">
          <p className="text-xl">スプリントポイント</p>
        </div>
        <p className="text-8xl font-bold">
          {isSelectNumberResult ? selectNumberCardAverage.toString() : "?"}
        </p>
      </div>
    </div>
  );
};
