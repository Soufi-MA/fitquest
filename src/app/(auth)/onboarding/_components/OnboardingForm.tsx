"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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
  finishSetupValidator,
  FinishSetupValidator,
} from "@/lib/validators/userValidators";
import { useToast } from "@/hooks/use-toast";
import {
  Gender,
  GenderType,
  LengthUnit,
  LengthUnitType,
  WeightUnit,
  WeightUnitType,
} from "@/db/schema/user";
import { finishSetup } from "../actions";
import { Calendar } from "@/components/ui/calendar";

const OnboardingForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FinishSetupValidator>({
    resolver: zodResolver(finishSetupValidator),
    defaultValues: {
      name: "",
      gender: Gender.MALE.value as GenderType,
      height: 0,
      lengthUnit: LengthUnit.CENTIMETER.value as LengthUnitType,
      weight: 0,
      weightUnit: WeightUnit.KILOGRAM.value as WeightUnitType,
      birthDay: undefined,
    },
  });

  const heightUnit = form.watch("lengthUnit");
  const weightUnit = form.watch("weightUnit");

  const [height, setHeight] = useState<number | undefined>(undefined);
  const [feet, setFeet] = useState(
    height ? Math.floor(height / 2.54 / 12) : undefined
  );
  const [inches, setInches] = useState(
    height ? Math.floor(height / 2.54) % 12 : undefined
  );

  const [weight, setWeight] = useState<number | undefined>(undefined);
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

  const onSubmit = async (data: FinishSetupValidator) => {
    setIsLoading(true);
    const res = await finishSetup(data);
    if (res === "ok") {
      toast({ title: "Saved Successfully!" });
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default OnboardingForm;
