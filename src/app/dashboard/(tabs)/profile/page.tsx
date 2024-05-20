import React from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";

const page = () => {
  return (
    <div className="flex flex-col rounded-md bg-muted py-4 shadow-md">
      <div className="flex flex-col px-8 pb-4">
        <p className="text-2xl font-semibold">Account Details</p>
        <p className="text-muted-foreground">Manage your FitQuest account</p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-2 px-8 py-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Soufi-MA" />
        </div>
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
          <Label htmlFor="age">Age</Label>
          <Input id="age" placeholder="Male" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input id="height" placeholder="172cm" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input id="weight" placeholder="53kg" type="number" />
        </div>
      </div>
      <div className="flex justify-end px-8 pb-4">
        <Button type="submit">Save Changes</Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-4 px-8 pt-4">
        <p className="text-2xl font-semibold">Delete Account</p>
        <div className="rounded-md bg-destructive/20 p-4 text-foreground">
          <p>Are you sure you want to delete your account?</p>
          <p className="text-sm">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            className="border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground"
            id="delete"
          />
          <label
            htmlFor="delete"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm my account deactivation
          </label>
        </div>
        <div>
          <Button disabled variant={"destructive"}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
