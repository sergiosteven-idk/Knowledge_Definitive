import 'dotenv/config';
import app from './server.js';
import { env } from './config/env.js';

const port = env.PORT;

app.listen(port, () => {
  console.log(`🚀 API Knowledge Definitive escuchando en http://localhost:${port}`);
});
