import { Link } from "react-router-dom";
import { IUser } from "../../types/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Divider from "./Divider";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addFriend,
  checkIsFriend,
  removeFriend,
} from "@/services/FriendService";
import { BsPersonFillCheck } from "react-icons/bs";
import { IoAddCircle } from "react-icons/io5";

type Props = {
  user: IUser;
  onClose: () => void;
};

const UserSearchCard = ({ user, onClose }: Props) => {
  const currentUser = useSelector((state: any) => state?.auth);
  const [isFriend, setIsFriend] = useState(false);

  const handleCheckUserIsFriend = async () => {
    const response = await checkIsFriend(currentUser.id, user.id);
    if (response?.status === 200) {
      setIsFriend(response?.data.data);
    }
  };

  const handleAddFriend = async () => {
    const response = await addFriend(currentUser.id, user.id);
    if (response?.status === 200) {
      setIsFriend(true);
    }
  };

  const handleRemoveFriend = async () => {
    const response = await removeFriend(currentUser.id, user.id);
    if (response?.status === 200) {
      setIsFriend(false);
    }
  };

  useEffect(() => {
    handleCheckUserIsFriend();
  }, [user, currentUser]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex justify-start items-center gap-3 p-2 lg:px-2 lg:py-8  border-transparent hover:bg-blue-200 rounded cursor-pointer shadow-md"
          >
            <Avatar>
              <AvatarImage
                className="w-10 h-10"
                src={user?.avatarUrl}
              />

              <AvatarFallback className="w-10 h-10">
                {(user?.username)[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-start">
              <div className="font-semibold text-ellipsis line-clamp-1 flex justify-start">
                {user?.username}
              </div>
              <p className="font-normal text-sm text-ellipsis line-clamp-1">
                {user?.email}
              </p>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account Info</DialogTitle>
          </DialogHeader>
          <Divider />
          <div className="flex items-center space-x-6">
            <Avatar>
              <AvatarImage
                className="w-28 h-28 rounded-full shadow-md"
                src={user?.avatarUrl}
              />

              <AvatarFallback className="w-28 h-28 rounded-full shadow-md text-2xl">
                {(user?.username)[0]}
              </AvatarFallback>
            </Avatar>
            <div className="font-semibold text-xl">
              {user?.username}
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
              <Button
                className="col-span-1 bg-gray-200 hover:bg-gray-300 text-black"
                onClick={onClose}
              >
                <Link to={`/${user?.id}`} className="w-full h-full">
                  Text
                </Link>
              </Button>
            </div>
          </div>
          <Divider />
          <div className="grid gap-4 pb-2">
            <div className="grid grid-cols-3 gap-4 items-center">
              <Label htmlFor="username">Email</Label>
              <div className="col-span-1">{user?.email}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <Label htmlFor="birthdate">Birthdate</Label>
              <div className="col-span-1">
                {user?.birthdate || "../../...."}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="col-span-1">
                {user?.phoneNumber || ".........."}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserSearchCard;
