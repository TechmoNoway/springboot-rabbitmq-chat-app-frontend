export type ILoginForm = {
  username: string;
  password: string;
};

export type IRegisterForm = {
  username: string;
  password: string;
  email: string;
};

export type IUpdateUser = {
  userId: number;
  username: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  birthdate: Date | undefined;
};

export type IUser = {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  birthdate: string;
  isActive: boolean;
  isBlocked: boolean;
};

export type IMessage = {
  senderId: number;
  receiverId: number;
  content: string;
  status: string;
  mediaType: string;
  mediaUrl: string;
  timestamp: Date | undefined;
};

export type IFriendSide = {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  birthdate: string;
  isActive: boolean;
  isBlocked: boolean;
  lastMessage: IMessage;
  status: string;
};
