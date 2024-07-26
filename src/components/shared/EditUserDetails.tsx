import React, { useEffect, useRef, useState } from "react";

import Divider from "./Divider";
import { useDispatch } from "react-redux";
import { IUser } from "@/types";
import { setUser } from "@/redux/authSlice";
import { useToast } from "../ui/use-toast";
import uploadFile from "../utils/uploadFile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { updateUser } from "@/services/UserService";

type Props = {
  onClose: () => void;
  user: IUser;
};

const EditUserDetails = ({ onClose, user }: Props) => {
  const [selectedBirthdate, setSelectedBirthdate] = useState<
    Date | undefined
  >();
  const [data, setData] = useState({
    username: user.username,
    avatarUrl: user.avatarUrl,
    email: user.email,
    birthdate: user.birthdate,
    phoneNumber: user.phoneNumber,
  });
  const uploadPhotoRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setData((prev) => {
      return {
        ...prev,
        ...user,
      };
    });
  }, [user]);

  const handleOnChange = (e: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleOpenUploadPhoto = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();
    e.stopPropagation();

    if (uploadPhotoRef.current) {
      uploadPhotoRef.current.click();
    }
  };

  const handleUploadPhoto = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const avatar = await uploadFile(file);

      setData((prev) => {
        return {
          ...prev,
          avatarUrl: avatar?.url,
        };
      });
    }
  };

  const handleSubmit = async (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updatedUser = {
        userId: user.id,
        username: data.username,
        avatarUrl: data.avatarUrl,
        email: data.email,
        birthdate: selectedBirthdate,
        phoneNumber: data.phoneNumber,
      };

      const response = await updateUser(updatedUser);

      toast({
        title: "Update profile successfully!",
      });

      if (response && response.data.data) {
        dispatch(
          setUser({
            ...user,
            birthdate: selectedBirthdate?.getTime(),
          })
        );
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Your Profile</h2>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div>
            <div className="my-1 flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  className="w-28 h-28"
                  src={data?.avatarUrl}
                />
                <AvatarFallback className="w-28 h-28">
                  {(data?.username)[0]}
                </AvatarFallback>
              </Avatar>
              <label htmlFor="avatarUrl">
                <button
                  className="font-semibold"
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="avatarUrl"
                  className="hidden"
                  onChange={(e) => handleUploadPhoto(e)}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <Input
              name="username"
              id="username"
              value={data.username}
              onChange={handleOnChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <Input
              name="email"
              id="email"
              value={data.email}
              onChange={handleOnChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="birthdate">Birthdate</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal text-black",
                    !selectedBirthdate &&
                      "text-muted-foreground text-black"
                  )}
                >
                  {selectedBirthdate && !user?.birthdate ? (
                    format(selectedBirthdate, "PPP")
                  ) : !selectedBirthdate && user?.birthdate ? (
                    format(Number(user?.birthdate), "PPP")
                  ) : selectedBirthdate && user?.birthdate ? (
                    format(selectedBirthdate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedBirthdate}
                  onSelect={setSelectedBirthdate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phoneNumber">Phone number</label>
            <Input
              name="phoneNumber"
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={handleOnChange}
            />
          </div>

          <Divider />
          <div className="flex gap-2 w-fit ml-auto ">
            <button
              onClick={onClose}
              className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
