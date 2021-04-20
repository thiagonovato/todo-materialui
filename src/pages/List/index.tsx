// Libs
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import { useAuth } from '../../contexts/auth';
import Header from '../../components/Header'
import { db } from '../../services/firebase';

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
import { ArrowBackRounded, Create, Mail, ShareRounded, WhatsApp } from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  tached: {
    textDecoration: 'line-through'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))

export default function ListPage(props: any) {
  const auth = useAuth()
  const { idUser, idList } = props.match.params
  const classes = useStyles();
  const [list, setList] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [nameNewList, setNameNewList] = useState('')
  const [openSnak, setOpenSnack] = useState(false)

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editItem, setEditItem] = useState<any>()


  const handleClickOpen = () => {
    setNameNewList('')
    setOpen(true);
  };

  const handleClickOpenEdit = (d: any, key: number) => {
    setNameNewList(d.title)
    setEditItem(key)
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const insertNewItem = () => {
    if (nameNewList.length < 3) return
    let itens = list.tasks || []
    itens.push({ title: nameNewList, createdAt: new Date(), checked: false })
    db.collection(idUser)
      .doc(idList)
      .update({
        tasks: itens,
        createdAt: new Date()
      })
    handleClose()
  }

  const saveNewItem = () => {
    if (nameNewList.length < 3) return
    let itens = list.tasks || []
    itens[editItem].title = nameNewList

    db.collection(idUser)
      .doc(idList)
      .update({
        tasks: itens,
      })

    handleCloseEdit()
  }

  const deleteList = (key: number) => {
    let newTasks = list.tasks
    newTasks.splice(key, 1)
    db.collection(idUser).doc(idList).update({
      tasks: newTasks
    })
  }

  useEffect(() => {
    async function loadToDos() {
      setLoading(true)
      db.collection(idUser).doc(idList).onSnapshot(snap => {
        let list: any = []
        list = snap.data()
        setList(list)
        setLoading(false)
      })
    }
    loadToDos()
  }, [])

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newTasks = list.tasks
    newTasks[Number(event.target.name)].checked = !newTasks[Number(event.target.name)].checked

    db.collection(idUser)
      .doc(idList)
      .update({
        tasks: newTasks,
        createdAt: new Date()
      })
  }

  const shareWhatsapp = () => {
    const link = `${process.env.REACT_APP_URL}/app/${idUser}/${idList}`
    let text = `Estou compartilhano minha lista ${list.title} com você. \n Segue o link: ${link}`
    text = window.encodeURIComponent(text)
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const shareEmail = () => {
    const link = `${process.env.REACT_APP_URL}/app/${idUser}/${idList}`
    let text = `Estou compartilhano minha lista ${list.title} com você. \n Segue o link: ${link}`
    text = window.encodeURIComponent(text)
    window.open(`mailto:?subject=Minha lista: ${list.title}&body=${text}`)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${process.env.REACT_APP_URL}/app/${idUser}/${idList}`)
    setOpenSnack(true)
  }

  const handleCloseSnack = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  return (<div>
    <Header />
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {loading && <Grid item xs={12}><Typography className={classes.heading}>Carregando...</Typography></Grid>}
        {!loading &&
          <>
            <Grid item xs={12} >
              {auth.user &&
                <Link to="/app">
                  <IconButton>
                    <ArrowBackRounded />
                  </IconButton>
                </Link>
              }
              <IconButton onClick={shareWhatsapp}>
                <WhatsApp />
              </IconButton>
              <IconButton onClick={shareEmail}>
                <Mail />
              </IconButton>
              <IconButton onClick={copyLink}>
                <ShareRounded />
              </IconButton>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnak}
                autoHideDuration={2000}
                onClose={handleCloseSnack}
                message="Link copiado!"
              />
              <Typography variant="h4">Lista: {list && list.title}</Typography>
            </Grid>

            <Grid item xs={12} >
              <IconButton onClick={handleClickOpen}><AddCircleIcon /></IconButton>Novo item
            </Grid>
            <Grid item xs={12} sm={8}>
              <List>
                {list.tasks && list.tasks.map((d: any, key: number) => (
                  <ListItem key={key} role={undefined} >
                    <ListItemIcon>
                      <Switch
                        checked={d.checked || false}
                        onChange={handleCheck}
                        name={String(key)}
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={`${d.title}`} className={d.checked && classes.tached} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments"
                        onClick={() => handleClickOpenEdit(d, key)}>
                        < Create />
                      </IconButton>
                      <IconButton edge="end" aria-label="comments"
                        onClick={() => { if (window.confirm(`Deletar a lista ${d.title} e seus itens?`)) { deleteList(key) }; }}>
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
                  - Clique em <AddCircleIcon /> <strong>Novo item</strong> para inserir um novo item em sua lista
                </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - Clique em <Switch /> para marcar esse item
                  </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - Clique em <TrashIcon /> para deletar um item da lista
                  </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - Clique em <WhatsApp /> para compartilhar esta lista via WhatsApp
                  </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - Clique em <Mail /> para compartilhar esta lista por email
                  </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'justify' }}>
                  - Clique em <ShareRounded /> para copiar a URL desta lista
                  </Typography>
              </Paper>
            </Grid>
          </>
        }
      </Grid>
    </Container>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Novo item</DialogTitle>
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
        <Button onClick={insertNewItem} color="primary" variant="contained">
          Salvar
          </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Editar item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nome"
          fullWidth
          variant="outlined"
          value={nameNewList}
          onChange={(e) => setNameNewList(e.target.value)}
          helperText="Mínimo 3 (três) caracteres"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEdit} color="primary">
          Cancelar
          </Button>
        <Button onClick={saveNewItem} color="primary" variant="contained">
          Salvar
          </Button>
      </DialogActions>
    </Dialog>
  </div >)
}