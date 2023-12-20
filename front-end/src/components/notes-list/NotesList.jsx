import styles from "./NotesList.module.css"
import { Title } from "../title/Title"
import { AddNewButton } from "../add-new-button/AddNewButton"
import { TopBar } from "../top-bar/TopBar"
import { ShortNote } from "../short-note/ShortNote"
import { Note } from "../note/Note"
import { useLoaderData, Outlet, NavLink } from "react-router-dom"

const NotesContainer = ({ children }) => <div className={styles["notes-container"]}>{children}</div>

const Notes = ({ children }) => (
  <div
    className={styles["notes-list"]}
    role='list'>
    {children}
  </div>
)

export function NotesList() {
  const notes = useLoaderData()

  return (
    <NotesContainer>
      <Notes>
        <TopBar>
          <Title>Notatki</Title>

          <AddNewButton>+</AddNewButton>
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
