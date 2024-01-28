declare global {

  interface User {
    id: any;
    email: any;
    name: any;
    id: any;
  }

  module "next-auth" {
    interface Session {
      user: User
    }
  }

}