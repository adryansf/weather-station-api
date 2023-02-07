// .ENV
// import 'dotenv/config';
import server from './app';

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`✅ Server is running at PORT: ${PORT}`));
