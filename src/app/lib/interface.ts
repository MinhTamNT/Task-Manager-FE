export interface IUser {
  uuid?: string;
  name?: string;
  email?: string;
}

export interface IProject {
  id: string;
  name?: string;
  description?: string;
  authorId?: string;
  author?: IUser;
  status?: string;
  members?: IUser[];
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
