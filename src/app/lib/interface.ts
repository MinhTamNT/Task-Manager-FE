export interface IUser {
  id?: string;
  uuid?: string;
  name?: string;
  email?: string;
  image?: string;
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

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: IUser[];
  dueDate: string;
  status: string;
  subTasks?: Task[];
}

export interface Notification {
  id: string;
  message: string;
  userId: string;
  projectId: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export interface NotificationCreatedData {
  notificationCreated: Notification;
}
