import Typography from '@material-ui/core/Typography';

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Vibbrante's test - Thiago Novato{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}