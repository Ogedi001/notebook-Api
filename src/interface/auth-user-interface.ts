
export interface Pagination_User {
    page: number;
    limit: number;
    totalPages: number;
    totalUsers: number;
  }

  export interface SharedUsers {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  }

  export interface UserRole{
    id:string,
    roleName:string
  }