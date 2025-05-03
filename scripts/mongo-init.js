// Read the application username and password from the secret files mounted by Docker
// Note: trim() removes potential trailing newlines from the secret files.
const appUser = cat('/run/secrets/DB_APP_USERNAME').trim();
const appPassword = cat('/run/secrets/DB_APP_PASSWORD').trim();
const targetDb = 'wishful'; // The database the application user needs access to

// Switch to the 'admin' database to create the user
db = db.getSiblingDB('admin');

print(`Attempting to create user '${appUser}' with access to database '${targetDb}'`);

db.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [{ role: 'readWrite', db: targetDb }],
});

print(`User '${appUser}' created successfully.`);
