const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('./prisma/prismaClient')
const app = express();
const path = require('path');


// Enable CORS for the frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Other middlewares (express.json, session, etc.)
app.use(express.json());

const pgSession = require('connect-pg-simple')(session);

app.use(
  session({
    store: new pgSession({
      conString: process.env.DATABASE_URL,
    }),
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  })
);

passport.use(new LocalStrategy(
    {
      usernameField: 'username', // This can be 'email' if you're using email to log in
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        // Find the user by their username
        const user = await prisma.user.findUnique({ where: { username: username } });
  
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
  
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        // If the password matches, return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);  // Log user serialization
    done(null, user.id);  // Store only the user ID in the session
  });
  
  // Deserialize the user by their ID stored in the session
passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      if (user) {
        done(null, user);
      } else {
        done(new Error("User not found"), null);
      }
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(error, null);
    }
  });

app.use(passport.initialize());
app.use(passport.session());

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

const loginRouter = require('./routes/login');
app.use('/login', loginRouter)

const logoutRouter = require('./routes/logout');
app.use('/logout', logoutRouter)

const homeRouter = require('./routes/home')
app.use('/home', homeRouter)

const profileRouter = require('./routes/profile')
app.use('/profile', profileRouter)

const userRouter = require('./routes/users')
app.use('/users', userRouter)

const uploadRouter = require('./routes/upload'); // Adjust the path to where upload.js is located
app.use('/upload', uploadRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/', (req, res) => {
    res.send('Server is running');
  });

app.listen(4000, () => {
  console.log('Server started on port 4000');
});

