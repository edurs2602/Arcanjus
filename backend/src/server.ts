import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(
    JSON.stringify({
      level: 'info',
      message: `Server running on port ${env.PORT}`,
      timestamp: new Date().toISOString(),
    }),
  );
});
