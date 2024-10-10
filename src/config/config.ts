// config/config.ts
const config = {
  backendUrl:
    process.env.REACT_APP_SERVER_USER_URL || 'https://150.136.153.235:30443',
  backendProjectUrl:
    process.env.REACT_APP_SERVER_PROJECT_URL || 'https://129.213.161.199:30443',
};

export default config;
