module.exports = {
  development: {
    username: process.env.DEVUN || 'sociovent',
    password: process.env.DEVPW || 'IN-telligent98',
    database: process.env.DEVDB || 'sociovent',
    host: process.env.DEVHOST || 'database-2.cma3dbx5jhql.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
  },
  production: {
    username: process.env.PRODUN,
    password: process.env.PRODPW,
    database: process.env.PRODDB,
    host: process.env.PRODHOST,
    dialect: 'mysql',
  },
  logging: true,
};
