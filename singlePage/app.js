const express = require("express");
const app = express();
app.use(express.json());
require('dotenv').config();
app.use(express.urlencoded({ extended: false }));

const session = require('express-session')
const passport = require("passport");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(session({ secret: "SESSION_SECRET" }));
app.use(passport.initialize());
app.use(passport.session());


const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(session({ secret: process.env.SESSION_SECERT }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LinkedInStrategy({
      clientID: '86gfqftrkqiaye',
      clientSecret: 'cYRzJinsXZcm84JK',
      callbackURL: "/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
   function (accessToken,refreshToken,profile,done) {
      process.nextTick(function(){
        return done(null, profile);
      });
    }
  )
);

app.get("/auth/linkedin",passport.authenticate("linkedin", { state: "SOME STATE" }));

app.get("/auth/linkedin/callback",passport.authenticate("linkedin", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/", (req, res) => {
  if (req.user) {
    const name = req.user.name.givenName;
    const family = req.user.name.familyName;
    const photo = req.user.photos[0].value;
    const email = req.user.emails[0].value;
    res.send(
      `<center style="font-size:140%"> <p>User is Logged In </p>
      <p>Name: ${name} ${family} </p>
      <p> Linkedn Email: ${email} </p>
      <img src="${photo}"/>
      <button onClick="window.location='http://localhost:4000/auth/logout'" >Logout</button>
      </center>`
      )
  } else {
    res.send(
    `<center style="font-size:160%"> <p>This is Home Page </p>
    <p>User is not Logged In</p>
    <img style="cursor:pointer;"  onclick="window.location='/auth/linkedIn'" src="http://www.bkpandey.com/wp-content/uploads/2017/09/linkedinlogin.png"/>
    </center>`
    );
  }
});
app.get('/auth/logout',(req,res)=>{
  req.logout((error)=>{
      if(error) {return};
      res.redirect('/')
  })
})

app.listen(4000);
console.log("App listening on port 4000");