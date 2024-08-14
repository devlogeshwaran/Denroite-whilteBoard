import { AlertColor } from "@mui/material";

export interface User {
  isLoggedIn: boolean;
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
}

export interface Board {
  createdBy: string
  currentParticipants: string[]
  id:string
  name:string

}
export interface AlertType {
  state: boolean;
  content: string;
  type: AlertColor | undefined
}