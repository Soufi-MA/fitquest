"use client";

import React, { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FinishSetupValidator,
  type TFinishSetupValidator,
} from "~/lib/validators/userValidators";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { cn } from "~/lib/utils";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const OnboardingForm = () => {
  const { update } = useSession();
  const router = useRouter();
  const form = useForm<TFinishSetupValidator>({
    resolver: zodResolver(FinishSetupValidator),
    defaultValues: {
      lengthUnit: "cm",
      weightUnit: "kg",
    },
  });

  const ftRef = useRef<HTMLInputElement>(null);
  const inchRef = useRef<HTMLInputElement>(null);
  const cmRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = api.users.finishSetup.useMutation({
    onError: (e) => {
      toast.error(e.message);
    },

    onSuccess: async () => {
      toast.success("Saved successfully");
      await update();
      router.replace("/dashboard");
    },
  });

  const onSubmit = (data: TFinishSetupValidator) => {
    mutate(data);
  };

  const handleFtToCm = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "ft" | "inch",
  ) => {
    if (ftRef.current && inchRef.current && cmRef.current) {
      const ftValue = Number(ftRef.current.value);
      const inchValue = Number(inchRef.current.value);
      cmRef.current.value = Math.round(
        ftValue * 30.48 + inchValue * 2.54,
      ).toString();

      form.setValue("height", Math.round(ftValue * 30.48 + inchValue * 2.54));
      await form.trigger();
      if (e.currentTarget) {
        if (!e.currentTarget.value) {
          e.currentTarget.value = "";
          return;
        }
        if (type === "ft") {
          e.currentTarget.value = Number(ftRef.current.value).toString();
        } else {
          e.currentTarget.value = Number(inchRef.current.value).toString();
        }
      }
    }
  };

  const handleCmToFt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cmValue = Number(e.currentTarget.value);
    if (ftRef.current && inchRef.current) {
      const ftValue = Math.floor(cmValue / 2.54 / 12);
      const inchValue = cmValue / 2.54 - 12 * ftValue;
      ftRef.current.value = ftValue.toFixed();
      inchRef.current.value = inchValue.toFixed();
      form.setValue("height", cmValue);
      await form.trigger();
      if (e.currentTarget) {
        if (!e.currentTarget.value) {
          e.currentTarget.value = "";
          return;
        }
        e.currentTarget.value = cmValue.toString();
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full select-none flex-col gap-2 p-4 md:px-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDay"
            render={() => (
              <FormItem className="space-y-2">
                <FormLabel>Birth Day</FormLabel>
                <FormControl>
                  <Input
                    className="cursor-pointer"
                    type="date"
                    {...form.register("birthDay", {
                      valueAsDate: true,
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={() => (
              <FormItem className="space-y-2">
                <div className="flex items-center gap-2">
                  <FormLabel>Height</FormLabel>
                  <FormField
                    control={form.control}
                    name="lengthUnit"
                    render={({ field }) => (
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="flex h-7 w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="min-w-0">
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="ft">ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
                <FormControl>
                  <div className="flex gap-1">
                    <Input
                      className="hidden"
                      type="number"
                      {...form.register("height", {
                        valueAsNumber: true,
                        validate: {
                          positive: (v) => v > 0,
                        },
                      })}
                      // disabled
                    />
                    <Input
                      type="number"
                      className={cn({
                        hidden: form.getValues("lengthUnit") === "ft",
                      })}
                      disabled={form.getValues("lengthUnit") === "ft"}
                      onChange={handleCmToFt}
                      max={300}
                      step={"any"}
                      ref={cmRef}
                    />

                    <Input
                      className={cn({
                        hidden: form.getValues("lengthUnit") === "cm",
                      })}
                      disabled={form.getValues("lengthUnit") === "cm"}
                      id="heightFeet"
                      type="number"
                      placeholder="6'"
                      ref={ftRef}
                      step={1}
                      onChange={(e) => handleFtToCm(e, "ft")}
                      max={10}
                    />
                    <Input
                      className={cn({
                        hidden: form.getValues("lengthUnit") === "cm",
                      })}
                      disabled={form.getValues("lengthUnit") === "cm"}
                      id="heightInches"
                      type="number"
                      placeholder="2''"
                      ref={inchRef}
                      step={1}
                      onChange={(e) => handleFtToCm(e, "inch")}
                      max={11}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={() => (
              <FormItem className="space-y-2">
                <div className="flex items-center gap-2">
                  <FormLabel>Weight</FormLabel>
                  <FormField
                    control={form.control}
                    name="weightUnit"
                    render={({ field }) => (
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="flex h-7 w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="min-w-0">
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...form.register("weight", {
                      valueAsNumber: true,
                      validate: {
                        positive: (v) => v > 0,
                      },
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={!form.formState.isValid || isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default OnboardingForm;
