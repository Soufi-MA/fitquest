"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const OnboardingForm = () => {
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");

  return (
    <div className="flex w-full flex-col gap-2 p-4 md:px-8">
      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthday">Birthday</Label>
          <Input id="birthday" required type="date" />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2" htmlFor="height">
            Height
            <Select>
              <SelectTrigger className="flex h-7 w-[80px]">
                <SelectValue placeholder="cm" />
              </SelectTrigger>
              <SelectContent className="min-w-0">
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="ft">ft</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          {/* <Input id="height" placeholder="172cm" type="number" /> */}
          <div className="flex gap-1">
            <Input id="heightFeet" type="number" placeholder="6'" />
            <Input id="heightInches" type="number" placeholder="2''" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2" htmlFor="weight">
            Weight
            <Select>
              <SelectTrigger className="flex h-7 w-[80px]">
                <SelectValue placeholder="kg" />
              </SelectTrigger>
              <SelectContent className="min-w-0">
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lb">lb</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          <Input id="weight" placeholder="53kg" type="number" />
        </div>
      </div>
      <Button>Continue</Button>
    </div>
  );
};

export default OnboardingForm;
