import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from './config';
 
const userPool = new CognitoUserPool(COGNITO_CONFIG);
 
// Inscription d'un nouvel utilisateur
export function signUp(email, password) {
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
 
// Confirmation du compte avec le code reçu par email
export function confirmSignUp(email, code) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
 
// Connexion — renvoie le token à utiliser pour les appels API
export function signIn(email, password) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });
 
  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          email,
        });
      },
      onFailure: (err) => reject(err),
    });
  });
}
 
// Récupère la session en cours (pour rester connecté après un refresh de page)
export function getCurrentSession() {
  const user = userPool.getCurrentUser();
  if (!user) return Promise.resolve(null);
 
  return new Promise((resolve) => {
    user.getSession((err, session) => {
      if (err || !session.isValid()) {
        resolve(null);
      } else {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          email: user.getUsername(),
        });
      }
    });
  });
}
 
export function signOut() {
  const user = userPool.getCurrentUser();
  if (user) user.signOut();
}