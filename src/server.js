import 'dotenv/config';
import app from './app';

app.listen(process.env.APP_PORT || 3333);
