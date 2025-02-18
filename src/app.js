const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const productsRouter=require('./routers/productsRouter');
const userRouter=require('./routers/userRouter');
const adminRouter=require('./routers/adminRouter');
const cartRouter = require('./routers/cartRouter');
const passport = require('passport');
require("./config/google_strategy")

const app=express();
app.use(cors(
   {
    origin:["http://localhost:5173","http://localhost:5174","http://localhost:3000"],
    credentials:true
   } 
));

//middlewares
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(passport.initialize());


//Route Definitions
app.use('/api',productsRouter);
app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use('/api',cartRouter);


// Google Authentication
app.get('/auth/google',
    passport.authenticate('google', {session:false, scope: ['profile', 'email'] }));
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', { session:false,failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) =>{
        const { user,accessToken,refreshToken,accessTokenExpiresIn,refreshTokenExpiresIn } = req.user;
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000, 
        });
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000, 
        });
        res.redirect (`${process.env.CLIENT_URL}`);
   
    });

app.get('/',(req,res)=>{
    res.send('Hello from server');
})




module.exports={app};