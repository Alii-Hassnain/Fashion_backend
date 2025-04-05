require('dotenv').config();
const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const productsRouter=require('./routers/productsRouter');
const userRouter=require('./routers/userRouter');
const adminRouter=require('./routers/adminRouter');
const cartRouter = require('./routers/cartRouter');
const orderRouter = require("./routers/orderRouter");
const passport = require('passport');
require("./config/google_strategy");

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")('sk_test_51Qt5f1IAryIsUHT2YN3ljJ4aLne5FHULLQQZxiDkTZNljoG5f45rKGnYwaMCA4k4GqUZ8F8Q3QVlF1FrVLbpm4DG00hoCK6VKD');



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
app.use("/api",orderRouter);

// app.post("/api/webhook", (req, res) => {
//   console.log("Received Webhook Data:", req.body);

//   // Response back to Botpress
//   res.json({ reply: `You said: ${req.body.userMessage}` });
// });


app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // Amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      // payment_method_types: ["card"],
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
    // res.send('Hello from server');
    res.json({mesg:"The name of the CEO is Ali Hassnain"})
})

app.post("/api/webhook", (req, res) => {
  console.log("Received  Data:", req.body);
  res.json({message:req.body})
})
  // Response back to Botpress

module.exports={app};