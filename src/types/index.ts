export type ILoginForm = {
  username: string;
  password: string;
};

export type IGoogleLoginForm = {
  username: any;
  email: any;
  accessToken: string;
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

export type IPartnerData = {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  isActive: boolean;
  birthdate: string;
  phoneNumber: string;
  status: string;
  isBlocked: boolean;
};

export type IMessage = {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  status: string;
  mediaType: string;
  mediaUrl: string;
  timestamp: Date | undefined;
};

export type ISaveMessage = {
  senderId: number;
  receiverId: number;
  content: string;
  status: string;
  mediaType: string;
  mediaUrl: string;
  timestamp: Date | undefined;
};

export type ISendMessage = {
  text: string;
  imageUrl: string;
  videoUrl: string;
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
