export interface Employee {
  id: number;
  name: string;
  email: string;
  extension: string;
  sector: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: number;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
