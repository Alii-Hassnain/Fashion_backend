require('dotenv').config();
const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const productsRouter=require('./routers/productsRouter');
const userRouter=require('./routers/userRouter');
const adminRouter=require('./routers/adminRouter');
const cartRouter = require('./routers/cartRouter');
const orderRouter = require("./routers/orderRouter");
const reviewRouter = require('./routers/reviewRouter');
const passport = require('passport');
const multer = require('multer');
const chatBot = require("./routers/botRouter")
require("./config/google_strategy");
const path=require('path');
const fs = require('fs');

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")('sk_test_51Qt5f1IAryIsUHT2YN3ljJ4aLne5FHULLQQZxiDkTZNljoG5f45rKGnYwaMCA4k4GqUZ8F8Q3QVlF1FrVLbpm4DG00hoCK6VKD');



const app=express();
app.use(cors(
   {
    origin:["http://localhost:5173","http://localhost:5174","http://localhost:3000","http://192.168.18.13:5173"],
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
app.use("/api",reviewRouter);
app.use("/chat",chatBot);


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
    console.log(req.user);
    
})



// app.post("/api/webhook", (req, res) => {
//   console.log("Received  Data:", req.body);
//   res.json({message:req.body})
// })

//    tryroom mobile image
const tempDir = path.join(__dirname, 'public', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('Directory created:', tempDir);
} else {
  console.log('Directory exists:', tempDir);
}
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    console.log("saving to : ",tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.sessionId}.jpg`);
  },
});
const upload = multer({ storage });




// Serve mobile upload page
app.get('/api/upload/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upload Image</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 class="text-2xl font-bold mb-4">Upload Image for Try Room</h1>
      <div class="flex flex-col gap-4 w-full max-w-md p-4">
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          class="p-2 border rounded w-full"
          onchange="previewImage(this)"
        />
        <button
          onclick="captureImage()"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Capture with Camera
        </button>
        <img id="preview" class="max-w-full h-auto mt-4 hidden" />
        <button
          onclick="uploadImage()"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Upload Image
        </button>
      </div>
      <script>
      const sessionId = "${sessionId}";
        function previewImage(input) {
          const preview = document.getElementById('preview');
          if (input.files && input.files[0]) {
            preview.src = URL.createObjectURL(input.files[0]);
            preview.classList.remove('hidden');
          }
        }

        function captureImage() {
          const fileInput = document.getElementById('fileInput');
          fileInput.setAttribute('capture', 'environment');
          fileInput.click();
        }

        async function uploadImage() {
          const fileInput = document.getElementById('fileInput');
          if (!fileInput.files[0]) {
            alert('Please select or capture an image');
            return;
          }
          const formData = new FormData();
          formData.append('image', fileInput.files[0]);
          try {
             const response = await fetch(\`/api/upload/\${sessionId}\`, {
              method: 'POST',
              body: formData,
            });
            if (response.ok) {
              alert('Image uploaded successfully');
              window.location.href = '/upload-success';
            } else {
              alert('Upload failed');
            }
          } catch (error) {
            alert('Error uploading image');
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Handle image upload
app.post('/api/upload/:sessionId', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    res.json({ success: true, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image: ' + error.message });
  }
});

// Success page after upload
app.get('/upload-success', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upload Success</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 class="text-2xl font-bold mb-4">Image Uploaded Successfully</h1>
      <p class="text-lg">Return to the Try Room on your main device.</p>
    </body>
    </html>
  `);
});

// Retrieve uploaded image
app.get('/api/image/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  const imagePath = path.join(tempDir, `${sessionId}.jpg`);
  console.log('Retrieving image:', imagePath);
  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
    // const imageDataUrl = `data:image/jpeg;base64,${fs.readFileSync(imagePath).toString('base64')}`;
    res.json({ imageDataUrl,success:true });
  } else {
    res.status(404).json({ error: 'Image not found',success:false });
  }
});





module.exports={app};