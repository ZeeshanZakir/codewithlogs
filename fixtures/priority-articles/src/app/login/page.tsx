import { login } from "./actions";

export default function Login() {
  return <main><h1>Sign in</h1><form action={login}>
    <label>Email <input name="email" type="email" autoComplete="username" required /></label>
    <label>Password <input name="password" type="password" autoComplete="current-password" required /></label>
    <button type="submit">Sign in</button>
  </form></main>;
}
