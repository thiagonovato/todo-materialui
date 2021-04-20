// Libs
import { useEffect } from 'react';

// Components
import { useAuth } from '../../contexts/auth';
import { db } from '../../services/firebase';


export default function NewListPage(props: any) {
  const auth = useAuth()
  const { newList } = props.match.params

  useEffect(() => {
    async function loadToDos() {
      db.collection(auth.user.uid)
        .add({
          title: newList,
          createdAt: new Date()
        }).then(result => {
          window.location.href = `/app/${auth.user.uid}/${result.id}`
        })
    }
    loadToDos()
  }, [])


  return (
    <div />
  )
}