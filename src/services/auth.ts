import { auth } from './firebase'

export class AuthService {
  public async login(email: string, password: string): Promise<any> {
    return auth.signInWithEmailAndPassword(email, password)
      .then((user: any) => {
        return user
      })
      .catch(function (error: any) {
        return error
      });

  }

  public async createUser(email: string, password: string): Promise<any> {
    return auth.createUserWithEmailAndPassword(email, password)
      .then((user: any) => {
        return user
      }).catch(function (error: any) {
        return error
      })
  }

  public logout() {
    auth.signOut().then(() => {
      return true
    }).catch((error: any) => {
      return false
    })
  }

}

const authService = new AuthService();
export default authService;