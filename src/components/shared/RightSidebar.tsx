import * as React from "react";
import { IPartnerData } from "../../types/index";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { BsPersonFillCheck } from "react-icons/bs";
import { IoAddCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import Divider from "./Divider";

interface RightSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  partnerData: IPartnerData;
  isFriend: boolean;
  handleAddFriend: () => void;
  handleRemoveFriend: () => void;
}

export function RightSidebar({
  partnerData,
  isFriend,
  handleAddFriend,
  handleRemoveFriend,
  ...props
}: RightSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-6 font-bold text-xl sticky">
        Account Info
      </SidebarHeader>
      <SidebarContent className="p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar>
              <AvatarImage
                className="w-28 h-28 rounded-full shadow-md"
                src={partnerData?.avatarUrl}
              />

              <AvatarFallback className="w-28 h-28 rounded-full shadow-md bg-slate-200 flex items-center justify-center">
                <p className="text-black text-2xl font-semibold">
                  {(partnerData?.username)[0]}
                </p>
              </AvatarFallback>
            </Avatar>
            {partnerData?.status === "online" && (
              <div className="absolute bg-green-600 p-[8px] bottom-2 -right-[-6px] z-10 rounded-full"></div>
            )}
            {partnerData?.status === "away" && (
              <div className="absolute bg-yellow-500 p-[8px] bottom-2 -right-[-6px] z-10 rounded-full"></div>
            )}
          </div>
          <div className="font-semibold text-xl">
            {partnerData?.username}
          </div>
        </div>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4 items-center">
            {isFriend ? (
              <Button
                className="col-span-1 bg-blue-200 hover:bg-blue-300  text-black space-x-1"
                onClick={handleRemoveFriend}
              >
                <BsPersonFillCheck className="w-4 h-4" />
                <p>Is friend</p>
              </Button>
            ) : (
              <Button
                className="col-span-1 bg-gray-200 hover:bg-gray-300 text-black space-x-1"
                onClick={handleAddFriend}
              >
                <IoAddCircle className="w-5 h-5" />
                <p> Add friend</p>
              </Button>
            )}
            <Button className="col-span-1 bg-gray-200 hover:bg-gray-300 text-black">
              <Link
                to={`/${partnerData?.id}`}
                className="w-full h-full"
              >
                Text
              </Link>
            </Button>
          </div>
        </div>
        <Divider />
        <div className="flex flex-col space-y-4">
          <div className="items-center">
            <Label htmlFor="username">Email</Label>
            <div className="">{partnerData?.email}</div>
          </div>
          <div className="items-center">
            <Label htmlFor="birthdate">Birthdate</Label>
            <div className="">
              {partnerData?.birthdate
                ? new Date(partnerData.birthdate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
          <div className="items-center">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="">
              {partnerData?.phoneNumber || ".........."}
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
