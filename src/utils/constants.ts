import { StepperStatesPros } from "src/types";

export const FIBONACCI_NUMBERS = [...Array(11)].map((d, i) => {
  const generateFibonacci = (num: number): number => {
    if (num < 2) {
      return num;
    } else {
      return generateFibonacci(num - 1) + generateFibonacci(num - 2);
    }
  };
  return i === 0 ? "/" : generateFibonacci(i + 1).toString();
});

export const FINISH: Array<StepperStatesPros<"finish">> = [
  {
    title: "完了!",
    status: "finish",
  },
  {
    title: "完了!",
    status: "finish",
  },
  {
    title: "完了!",
    status: "finish",
  },
];

export const IN_PROGRESS: Array<StepperStatesPros<"process">> = [
  { title: "キャッシュを削除中...", status: "process" },
  { title: "ユーザーを作成中...", status: "process" },
  { title: "部屋を作成中...", status: "process" },
];

export const WAITING: Array<StepperStatesPros<"wait">> = [
  { title: "待機中", status: "wait" },
  { title: "待機中", status: "wait" },
  { title: "待機中", status: "wait" },
];

export const STEPPER_STATES_LIST = {
  FINISH,
  IN_PROGRESS,
  WAITING,
};
