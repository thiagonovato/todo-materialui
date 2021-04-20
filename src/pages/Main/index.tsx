// Libs
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

// Components
import Header from '../../components/Header'
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/auth';

// Material UI
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TrashIcon from '@material-ui/icons/DeleteForever'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))

export default function Main() {
  const classes = useStyles();
  const auth = useAuth()
  const [data, setData] = useState<[]>()
  const [loading, setLoading] = useState(false)
  const [nameNewList, setNameNewList] = useState('')

  const [open, setOpen] = useState(false);


  const handleClickOpen = () => {
    setNameNewList('')
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const insertNewList = () => {
    if (nameNewList.length < 3) return
    db.collection(auth.user.uid)
      .add({
        title: nameNewList,
        createdAt: new Date()
      })
    handleClose()
  }

  const deleteList = (id: any) => {
    db.collection(auth.user.uid).doc(id).delete()
  }

  useEffect(() => {
    async function loadToDos() {
      setLoading(true)
      db.collection(auth.user.uid).orderBy('createdAt', 'desc').onSnapshot(snap => {
        let data: any = []
        snap.forEach(doc => {
          data.push({
            id: doc.id,
            ...doc.data()
          })
        })

        setData(data)
        setLoading(false)
      })
    }
    loadToDos()
  }, [])

  return (<div>
    <Header />
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {loading && <Grid item xs={12}><Typography className={classes.heading}>Carregando...</Typography></Grid>}
        {!loading &&
          <>
            <Grid item xs={12}>
              <Typography variant="h4">Minhas listas</Typography>
            </Grid>
            <Grid item xs={12} ><IconButton onClick={handleClickOpen}><AddCircleIcon /></IconButton>Nova lista</Grid>
            <Grid item xs={12} sm={8}>
              <List>
                {data && data.map((d: any) => (
                  <ListItem key={d} role={undefined} dense button component={RouterLink} to={`/app/${auth.user.uid}/${d.id}`}>
                    <ListItemIcon>
                      <DoubleArrowIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${d.title}`} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments"
                        onClick={() => { if (window.confirm(`Deletar a lista ${d.title} e seus itens?`)) { deleteList(d.id) }; }}>
                        <TrashIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.paper}>
                <Typography variant="h6">O que é o ToDo?</Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>ToDo é uma aplicação que permite criar listas e itens em suas listas. É possível mudar o status (marcar) um item que já foi feito/concluído. É bastante útil para montar uma lista de compras, ou uma lista de atividades a serem feitas durante o dia.</Typography>
                <Typography variant="h6">Como usar</Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - Clique em <AddCircleIcon /> <strong>Nova lista</strong> para inserir uma nova lista
                </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - É possível também criar uma nova lista digitando o nome dela na URL após o "app/". Exemplo: ".../app/NOME_DA_LISTA"
                </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - Clique no nome da lista para acessar seu conteúdo
                  </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - Clique em <TrashIcon /> para deletar uma lista
                  </Typography>
              </Paper>
            </Grid>
          </>
        }
      </Grid>
    </Container>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Nova lista</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nome"
          fullWidth
          variant="outlined"
          onChange={(e) => setNameNewList(e.target.value)}
          helperText="Mínimo 3 (três) caracteres"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
          </Button>
        <Button onClick={insertNewList} color="primary" variant="contained">
          Salvar
          </Button>
      </DialogActions>
    </Dialog>
  </div >)
}