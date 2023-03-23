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
    id: "finish_1",
    title: "完了!",
    status: "finish",
  },
  {
    id: "finish_2",
    title: "完了!",
    status: "finish",
  },
  {
    id: "finish_3",
    title: "完了!",
    status: "finish",
  },
];

export const IN_PROGRESS: Array<StepperStatesPros<"process">> = [
  { id: "process_1", title: "キャッシュを削除中...", status: "process" },
  { id: "process_2", title: "ユーザーを作成中...", status: "process" },
  { id: "process_3", title: "部屋を作成中...", status: "process" },
];

export const WAITING: Array<StepperStatesPros<"wait">> = [
  { id: "wait_1", title: "待機中", status: "wait" },
  { id: "wait_2", title: "待機中", status: "wait" },
  { id: "wait_3", title: "待機中", status: "wait" },
];

export const STEPPER_STATES_LIST = {
  FINISH,
  IN_PROGRESS,
  WAITING,
};
