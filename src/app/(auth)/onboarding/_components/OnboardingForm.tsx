"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  ActivityLevel,
  Gender,
  GenderType,
  Goal,
  GoalRate,
  LengthUnit,
  LengthUnitType,
  WeightUnit,
  WeightUnitType,
} from "@/db/schema/user";
import {
  submitOnboadingStep1,
  submitOnboadingStep2,
  submitOnboadingStep3,
} from "../actions";
import { Calendar } from "@/components/ui/calendar";
import {
  onboadingStep1,
  OnboadingStep1,
  onboadingStep2,
  OnboadingStep2,
  onboadingStep3,
  OnboadingStep3,
} from "@/lib/validators/userValidators";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User } from "@/lib/session";

interface StepProps {
  user: User;
  step: number;
}

const OnboardingForm = ({
  step,
  user,
  userPreference,
}: {
  step: 1 | 2 | 3;
  user: User;
  userPreference: {
    id: string;
    userId: number;
    lengthUnit: LengthUnitType;
    weightUnit: WeightUnitType;
  } | null;
}) => {
  const steps = [
    <Step1 step={step} user={user} />,
    <Step2 step={step} user={user} userPreference={userPreference} />,
    <Step3 step={step} user={user} />,
  ];

  return <>{steps[step - 1]}</>;
};

const Step1 = ({ step, user }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OnboadingStep1>({
    resolver: zodResolver(onboadingStep1),
    defaultValues: {
      name: user.name ?? "",
      gender: user.gender ?? (Gender.MALE.value as GenderType),
      birthDay: user.birthDay ?? undefined,
    },
  });

  const onSubmit = async (data: OnboadingStep1) => {
    setIsLoading(true);
    const res = await submitOnboadingStep1(data);
    if (res === "ok") {
      redirect(`/onboarding/${Number(step) + 1}`);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.MALE.value}>
                      {Gender.MALE.label}
                    </SelectItem>
                    <SelectItem value={Gender.FEMALE.value}>
                      {Gender.FEMALE.label}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      captionLayout="dropdown-buttons"
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      fromDate={new Date("1900-01-01")}
                      toDate={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 18)
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-4 w-full">
          {isLoading ? (
            <div className="flex gap-2 items-center">
              <Loader2 className="animate-spin" /> Please Wait...
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  );
};

const Step2 = ({
  step,
  user,
  userPreference,
}: StepProps & {
  userPreference: {
    id: string;
    userId: number;
    lengthUnit: LengthUnitType;
    weightUnit: WeightUnitType;
  } | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OnboadingStep2>({
    resolver: zodResolver(onboadingStep2),
    defaultValues: {
      height: Number(user.height) ?? 0,
      lengthUnit:
        userPreference?.lengthUnit ??
        (LengthUnit.CENTIMETER.value as LengthUnitType),
      weight: Number(user.weight) ?? 0,
      weightUnit:
        userPreference?.weightUnit ??
        (WeightUnit.KILOGRAM.value as WeightUnitType),
    },
  });

  const heightUnit = form.watch("lengthUnit");
  const weightUnit = form.watch("weightUnit");

  const [height, setHeight] = useState(
    user.height ? Math.round(user.height) : undefined
  );
  const [feet, setFeet] = useState(
    height ? Math.floor(height / 2.54 / 12) : undefined
  );
  const [inches, setInches] = useState(
    height ? Math.floor(height / 2.54) % 12 : undefined
  );

  const [weight, setWeight] = useState(
    user.weight ? Math.round(user.weight) : undefined
  );
  const [lb, setLb] = useState(
    weight ? Math.floor(weight / WeightUnit.POUND.conversion) : undefined
  );

  const sanitizeValue = (value: string, max: number) => {
    const numricValue = Number(value);
    if (isNaN(numricValue) || value === "") {
      return undefined;
    }
    if (numricValue < 1) {
      return 1;
    } else if (numricValue > max) {
      return max;
    }
    return numricValue;
  };

  const handleCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeValue(e.target.value, 300);
    if (!sanitizedValue) {
      setHeight(undefined);
      setFeet(undefined);
      setInches(undefined);
      return;
    }

    form.setValue("height", sanitizedValue, { shouldValidate: true });
    setHeight(sanitizedValue);
    const totalInches = sanitizedValue / 2.54;
    setFeet(Math.floor(totalInches / 12));
    setInches(Math.round(totalInches % 12));
  };

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeValue(e.target.value, 10);
    if (!sanitizedValue) {
      setHeight(undefined);
      setFeet(undefined);
      setInches(undefined);
      return;
    }

    setFeet(sanitizedValue);
    const feetInches = sanitizedValue * 12;
    const totalInches = feetInches + (inches ?? 0);
    form.setValue("height", Math.floor(totalInches * 2.54), {
      shouldValidate: true,
    });
    setHeight(Math.floor(totalInches * 2.54));
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeValue(e.target.value, 12);
    if (!sanitizedValue) {
      setHeight(undefined);
      setFeet(undefined);
      setInches(undefined);
      return;
    }

    setInches(sanitizedValue);
    const totalInches = (feet ?? 0) * 12 + sanitizedValue;
    form.setValue("height", Math.floor(totalInches * 2.54), {
      shouldValidate: true,
    });
    setHeight(Math.floor(totalInches * 2.54));
  };

  const handleKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeValue(e.target.value, 300);
    if (!sanitizedValue) {
      setWeight(undefined);
      setLb(undefined);
      return;
    }

    form.setValue("weight", sanitizedValue, { shouldValidate: true });
    setWeight(sanitizedValue);
    setLb(Math.floor(sanitizedValue * 2.2));
  };

  const handleLbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeValue(e.target.value, 660);
    if (!sanitizedValue) {
      setWeight(undefined);
      setLb(undefined);
      return;
    }
    setLb(sanitizedValue);
    form.setValue(
      "weight",
      Math.floor(sanitizedValue * WeightUnit.POUND.conversion),
      {
        shouldValidate: true,
      }
    );
    setWeight(Math.floor(sanitizedValue * WeightUnit.POUND.conversion));
  };

  const onSubmit = async (data: OnboadingStep2) => {
    setIsLoading(true);
    const res = await submitOnboadingStep2(data);
    if (res === "ok") {
      redirect(`/onboarding/${Number(step) + 1}`);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-start gap-2">
            <FormField
              name="height"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="height">Height</FormLabel>
                  <input {...field} hidden readOnly />

                  <div className="flex gap-2 flex-grow">
                    {heightUnit === "CENTIMETER" ? (
                      <Input
                        id="height"
                        value={typeof height !== "undefined" ? height : ""}
                        onChange={handleCmChange}
                        placeholder="Centimeters"
                        className="flex-grow"
                      />
                    ) : (
                      <>
                        <Input
                          id="height-feet"
                          value={typeof feet !== "undefined" ? feet : ""}
                          onChange={handleFeetChange}
                          placeholder="Feet"
                          className="w-1/2"
                        />
                        <Input
                          id="height-inches"
                          value={typeof inches !== "undefined" ? inches : ""}
                          onChange={handleInchesChange}
                          placeholder="Inches"
                          className="w-1/2"
                        />
                      </>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lengthUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lengthUnit">Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LengthUnit.CENTIMETER.value}>
                        {LengthUnit.CENTIMETER.label}
                      </SelectItem>
                      <SelectItem value={LengthUnit.INCH.value}>
                        {LengthUnit.INCH.label}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-start gap-2">
            <FormField
              name="weight"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="weight">Weight</FormLabel>
                  <input {...field} hidden readOnly />
                  <div className="flex gap-2 flex-grow">
                    {weightUnit === "KILOGRAM" ? (
                      <Input
                        id="weight"
                        value={typeof weight !== "undefined" ? weight : ""}
                        onChange={handleKgChange}
                        placeholder="Kilograms"
                        className="flex-grow"
                      />
                    ) : (
                      <Input
                        id="weight"
                        value={typeof lb !== "undefined" ? lb : ""}
                        onChange={handleLbChange}
                        placeholder="Pounds"
                        className="flex-grow"
                      />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="weightUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="weightUnit">Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={WeightUnit.KILOGRAM.value}>
                        {WeightUnit.KILOGRAM.label}
                      </SelectItem>
                      <SelectItem value={WeightUnit.POUND.value}>
                        {WeightUnit.POUND.label}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-2 w-full mt-4">
          <Link className={buttonVariants()} href={`/onboarding/${step - 1}`}>
            Back
          </Link>
          <Button type="submit" className="">
            {isLoading ? (
              <div className="flex gap-2 items-center">
                <Loader2 className="animate-spin" /> Please Wait...
              </div>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const Step3 = ({ step, user }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OnboadingStep3>({
    resolver: zodResolver(onboadingStep3),
    defaultValues: {},
  });

  const goalType = form.watch("goalType");

  const onSubmit = async (data: OnboadingStep3) => {
    setIsLoading(true);
    const res = await submitOnboadingStep3(data);
    if (res === "ok") {
      redirect("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="goalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="goalType">Primary Goal</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Goal.MUSCLE_GAIN.value}>
                      {Goal.MUSCLE_GAIN.label}
                    </SelectItem>
                    <SelectItem value={Goal.WEIGHT_LOSS.value}>
                      {Goal.WEIGHT_LOSS.label}
                    </SelectItem>
                    <SelectItem value={Goal.WEIGHT_MAINTENANCE.value}>
                      {Goal.WEIGHT_MAINTENANCE.label}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {goalType !== "WEIGHT_MAINTENANCE" && (
            <FormField
              name="goalWeight"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="goalWeight">
                    Target Weight (Optional)
                  </FormLabel>
                  <input {...field} hidden readOnly />
                  <div className="flex gap-2 flex-grow">
                    <Input
                      id="goalWeight"
                      placeholder=""
                      className="flex-grow"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {goalType !== "WEIGHT_MAINTENANCE" && (
            <FormField
              control={form.control}
              name="goalRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="goalRate">Goal Rate</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GoalRate.SLOW.value}>
                        {goalType === "MUSCLE_GAIN"
                          ? GoalRate.SLOW.weightGainPerWeek.description
                          : GoalRate.SLOW.weightLossPerWeek.description}
                      </SelectItem>
                      <SelectItem value={GoalRate.MODERATE.value}>
                        {goalType === "MUSCLE_GAIN"
                          ? GoalRate.MODERATE.weightGainPerWeek.description
                          : GoalRate.MODERATE.weightLossPerWeek.description}
                      </SelectItem>
                      <SelectItem value={GoalRate.AGGRESSIVE.value}>
                        {goalType === "MUSCLE_GAIN"
                          ? GoalRate.AGGRESSIVE.weightGainPerWeek.description
                          : GoalRate.AGGRESSIVE.weightLossPerWeek.description}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="activityLevel">Activity Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ActivityLevel.SEDENTARY.value}>
                      {ActivityLevel.SEDENTARY.description}
                    </SelectItem>
                    <SelectItem value={ActivityLevel.LIGHTLY_ACTIVE.value}>
                      {ActivityLevel.LIGHTLY_ACTIVE.description}
                    </SelectItem>
                    <SelectItem value={ActivityLevel.MODERATELY_ACTIVE.value}>
                      {ActivityLevel.MODERATELY_ACTIVE.description}
                    </SelectItem>
                    <SelectItem value={ActivityLevel.VERY_ACTIVE.value}>
                      {ActivityLevel.VERY_ACTIVE.description}
                    </SelectItem>
                    <SelectItem value={ActivityLevel.EXTREMELY_ACTIVE.value}>
                      {ActivityLevel.EXTREMELY_ACTIVE.description}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-2 w-full mt-4">
          <Link className={buttonVariants()} href={`/onboarding/${step - 1}`}>
            Back
          </Link>
          <Button type="submit" className="">
            {isLoading ? (
              <div className="flex gap-2 items-center">
                <Loader2 className="animate-spin" /> Please Wait...
              </div>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OnboardingForm;
