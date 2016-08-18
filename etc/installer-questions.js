module.exports = [
  {
    type: 'input',
    name: 'DB_HOST',
    message: 'Database host address or ip',
    default: '127.0.0.1'
  },
  {
    type: 'input',
    name: 'DB_PORT',
    message: 'Database port',
    default: '5432'
  },
  {
    type: 'input',
    name: 'DB_NAME',
    message: 'Database name',
    default: 'postgres'
  },
  {
    type: 'input',
    name: 'DB_SCHEMA',
    message: 'Database schema',
    default: 'public'
  },
  {
    type: 'input',
    name: 'DB_ADMIN_USERNAME',
    message: 'Database admin username',
    default: 'postgres'
  },
  {
    type: 'password',
    name: 'DB_ADMIN_PASSWORD',
    message: 'Database admin password',
    default: 'postgres'
  },
  {
    type: 'input',
    name: 'DB_READ_USERNAME',
    message: 'Database read-only username',
    default: 'web'
  },
  {
    type: 'password',
    name: 'DB_READ_PASSWORD',
    message: 'Database read-only password',
    default: 'web'
  }
];
