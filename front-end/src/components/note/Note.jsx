import RemoveIcon from "../../assets/remove.svg"
import styles from "./Note.module.css"
import { TopBar } from "../top-bar/TopBar"
import { useLoaderData, Form, useSubmit, redirect } from "react-router-dom"
import { useCallback } from "react"
import { debounce } from "../../utils/debounce"

const NoteEditor = ({ children }) => <div className={styles["note-editor"]}>{children}</div>

export async function updateNote({ request, params }) {
  const data = await request.formData()
  const title = data.get("title")
  const body = data.get("body")
  return fetch(`http://localhost:3000/notes/${params.noteId}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
      body,
    }),
    headers: {
      "Content-type": "application/json",
    },
  })
}

export async function deleteNote({ request, params }) {
  const formData = await request.formData()
  const title = formData.get("title")
  const body = formData.get("body")
  const folderId = formData.get("folderId")

  await fetch(`http://localhost:3000/notes/${params.noteId}`, {
    method: "DELETE",
  })
  return fetch(`http://localhost:3000/archive/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ title, body, folderId }),
  }).then(() => {
    return redirect(`/notes/${params.folderId}`)
  })
}

export function Note() {
  const note = useLoaderData()
  const submit = useSubmit()

  const onChangeCallback = useCallback(
    debounce(e => {
      const form = e.target.closest("form")
      submit(form, { method: "PATCH" })
    }, 300),
    [debounce, submit]
  )

  return (
    <div className={styles.container}>
      <TopBar>
        <Form
          method='DELETE'
          action='delete'
          onSubmit={e => {
            e.preventDefault()
            const formData = new FormData()
            formData.append("title", note.title)
            formData.append("body", note.body)
            formData.append("folderId", note.folderId)
            submit(formData, {
              method: "DELETE",
              action: "delete",
            })
          }}>
          <button className={styles.button}>
            <img
              className={styles.image}
              src={RemoveIcon}
            />
          </button>
        </Form>
      </TopBar>

      <Form
        method='PATCH'
        onChange={onChangeCallback}>
        <NoteEditor key={note.id}>
          <input
            type='text'
            name='title'
            defaultValue={note.title}
          />
          <textarea
            name='body'
            defaultValue={note.body}
          />
        </NoteEditor>
      </Form>
    </div>
  )
}
