import { redirect } from "next/navigation";
import { readOwnNotes } from "@/lib/notes";
import { AuthenticationRequired } from "@/lib/authorization";
import { addNote } from "./actions";
import { logout } from "@/app/login/actions";

export default async function Dashboard() {
  let notes;
  try { notes = await readOwnNotes(); }
  catch (error) {
    if (error instanceof AuthenticationRequired) redirect("/login");
    throw error;
  }
  return <main><h1>Your notes</h1><ul>{notes.map(note => <li key={note.id}>{note.body}</li>)}</ul>
    <form action={addNote}><label>Note <input name="body" maxLength={2000} required /></label><button type="submit">Add note</button></form>
    <form action={logout}><button type="submit">Sign out</button></form>
  </main>;
}
