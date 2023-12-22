import styles from "./NotesList.module.css"
import { Title } from "../title/Title"
import { AddNewButton } from "../add-new-button/AddNewButton"
import { TopBar } from "../top-bar/TopBar"
import { ShortNote } from "../short-note/ShortNote"
import { Note } from "../note/Note"
import { useLoaderData, Outlet, NavLink, Form, redirect } from "react-router-dom"

const NotesContainer = ({ children }) => <div className={styles["notes-container"]}>{children}</div>

const Notes = ({ children }) => (
  <div
    className={styles["notes-list"]}
    role='list'>
    {children}
  </div>
)

export function createNote({ params }) {
  return fetch("http://localhost:3000/notes", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title: "Nowa notatka",
      body: "Treść notatki",
      folderId: Number(params.folderId),
    }),
  })
    .then(res => res.json())
    .then(newNote => {
      return redirect(`/notes/${newNote.folderId}/note/${newNote.id}`)
    })
}

export function NotesList() {
  const notes = useLoaderData()

  return (
    <NotesContainer>
      <Notes>
        <TopBar>
          <Title>Notatki</Title>
          <Form method='POST'>
            <AddNewButton>+</AddNewButton>
          </Form>
        </TopBar>

        {notes.map((note, idx) => (
          <NavLink
            key={idx}
            to={`/notes/${note.folderId}/note/${note.id}`}>
            {({ isActive }) => {
              return (
                <ShortNote
                  role='listitem'
                  active={isActive}
                  note={note}></ShortNote>
              )
            }}
          </NavLink>
        ))}
      </Notes>
      <Outlet />
    </NotesContainer>
  )
}
