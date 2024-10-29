"use client";

import * as React from "react";
import { TimePickerInput } from "./time-picker-input";
import { TimePeriodSelect } from "./period-select";
import { Period } from "./time-picker-utils";

interface TimePickerDemoProps {
  date: Date | undefined;
  setDateAction: (date: Date | undefined) => void;
}

export function TimePicker12Demo({ date, setDateAction }: TimePickerDemoProps) {
  const [period, setPeriod] = React.useState<Period>("AM");

  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-center gap-1 border rounded-md">
      <div className="grid gap-1 text-center">
        <TimePickerInput
          className="border-0"
          picker="12hours"
          period={period}
          date={date}
          setDate={setDateAction}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <p>:</p>
      <div className="grid gap-1 text-center">
        <TimePickerInput
          className="border-0"
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={setDateAction}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <TimePeriodSelect
          className="border-0"
          period={period}
          setPeriod={setPeriod}
          date={date}
          setDate={setDateAction}
          ref={periodRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>
    </div>
  );
}
