const User = require('../Model/User');
const Deposit = require('../Model/depositSchema');
const Widthdraw = require('../Model/widthdrawSchema');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '', };
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
    return jwt.sign({ id }, 'piuscandothis', {
      expiresIn: maxAge
    });
  };








module.exports.homePage = (req, res)=>{
res.render("index")
}


    module.exports.registerPage = (req, res)=>{
        res.render("register")
    }

    module.exports.loginAdmin = (req, res) =>{
        res.render('loginAdmin');
    }
    
    const sendEmail = async ( fullname, email,  password ) =>{
    
        try {
          const transporter =  nodemailer.createTransport({
            host: 'mail.globalflextyipsts.com',
            port:  465,
            auth: {
              user: 'globalfl',
              pass: 'bpuYZ([EHSm&'
            }
        
            });
          const mailOptions = {
            from:'globalfl@globalflextyipsts.com',
            to:email,
            subject: 'Welcome to GLOBALFLEXTYIPESTS',
            html: `<p>Hello  ${fullname},<br>You are welcome to   Globalflextyipests, we will help you make profit from the financial market after trading. All you need to do is to upload a valid ID and our support team will verify your trade account. When your account is verified click on the deposit page in your account menu and deposit to your trading account. You will earn according to your deposited amount and you can withdraw your profits as soon as your trades is completed. Good luck and we are waiting to get testimonies from you.
      
            Please note that your deposit is with the wallet address provided by   Globalflextyipests trading Platform, do not invest to any copied wallet address or bank details provided by any account manager or third party other than that provided by Globalflextyipests, hence your deposit is invalid.<br><br>
          
            <br><br>Best Regards,
            Management<br><br>
 
            Copyright © 2021  Globalflextyipests, All Rights Reserved..<br><br>
            Your login information:<br>Email: ${email}<br>Password: ${password}<br><br>You can login here: <br>  Contact us immediately if you did not authorize this registration.<br>Thank you.</p>`
        }
        transporter.sendMail(mailOptions, (error, info) =>{
          if(error){
              console.log(error);
              res.send('error');
          }else{
              console.log('email sent: ' + info.response);
              res.send('success')
          }
      })
      
      
        } catch (error) {
          console.log(error.message);
        }
      }
      
      


module.exports.register_post = async (req, res) =>{
    const {fullname, email, country,tel, password, } = req.body;
    try {
        const user = await User.create({fullname, email, country, tel, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });

        // if(user){
        //   sendEmail(req.body.fullname,req.body.email, req.body.password)
        // }else{
        //   console.log(error);
        // }
      }
        catch(err) {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
          }
    
}

module.exports.loginPage = (req, res)=>{
    res.render("login")
}
const loginEmail = async (  email ) =>{
    
    try {
      const transporter =  nodemailer.createTransport({
        host: 'mail.globalflextyipsts.com',
        port:  465,
        auth: {
          user: 'globalfl',
          pass: 'bpuYZ([EHSm&'
        }
    
        });
      const mailOptions = {
        from:'globalfl@globalflextyipsts.com',
        to:email,
        subject: 'Your account has recently been logged In',
        html: `<p>Greetings,${email}<br>your trading account has just been logged in by a device .<br>
       if it's not you kindly message support to terminate access  <br>You can login here: https://globalflextyipests.com/login.<br>Thank you.</p>`
    }
    transporter.sendMail(mailOptions, (error, info) =>{
      if(error){
          console.log(error);
          res.send('error');
      }else{
          console.log('email sent: ' + info.response);
          res.send('success')
      }
  })
  
  
    } catch (error) {
      console.log(error.message);
    }
  }
  

  module.exports.login_post = async(req, res) =>{
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });

        // if(user){
        //   loginEmail(req.body.email)
        // }else{
        //   console.log(error);
        // }
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
}

module.exports.dashboardPage = async(req, res) =>{
  res.render('dashboard');
}


module.exports.accountPage = async(req, res) =>{
  const id = req.params.id
  const user = await User.findById(id);
  res.render('account',{user})
}

module.exports.editProfilePage = async(req, res)=>{
  try {
    await User.findByIdAndUpdate(req.params.id,{
      fullname: req.body.fullname,
      tel: req.body.tel,
      address: req.body.address,
      city: req.body.city,
      postal: req.body.postal,
      updatedAt: Date.now()
    });

      await res.redirect(`/account/${req.params.id}`);
      
      console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.transactionPage = async(req, res)=>{
    res.render("transactions")
}


module.exports.depositPage = async(req, res) =>{
    res.render("fundAccount")
}

module.exports.widthdrawPage = async(req, res)=>{
    res.render("widthdrawFunds")
}


module.exports.tradePage = async(req, res)=>{
  res.render("trades")
}

module.exports.referPage = async(req, res)=>{
  res.render("refer")
}

module.exports.premiumPage = async(req, res)=>{
  res.render("invest")
}


  
  module.exports.depositHistory = async(req, res) =>{
    try {
      const id = req.params.id
  const user = await User.findById(id).populate("deposits")
    res.render('depositHistory',{user});
    } catch (error) {
      console.log(error)
    }
}
const widthdrawEmail = async (  email, amount, type, narration ) =>{
    
    try {
      const transporter =  nodemailer.createTransport({
        host: 'mail.globalflextyipsts.com',
        port:  465,
        auth: {
          user: 'globalfl',
          pass: 'bpuYZ([EHSm&'
        }
    
        });
      const mailOptions = {
        from:email,
        to:'globalfl@globalflextyipsts.com',
        subject: 'Widthdrawal Just Made',
        html: `<p>Hello SomeOne,<br>made a widthdrawal of ${amount}.<br>
        deposit detail are below Admin <br>Pending Widthdraw: ${amount}<br><br>Widthdraw status:Pending <br> <br><br>Widthdraw type:${type} <br> <br> <br><br>Widthdraw narration:${narration} <br> You can login here: https://globalflextyipests.com/loginAdmin<br> to approve the widthdrawal.<br>Thank you.</p>`
    }
    transporter.sendMail(mailOptions, (error, info) =>{
      if(error){
          console.log(error);
          res.send('error');
      }else{
          console.log('email sent: ' + info.response);
          res.send('success')
      }
  
  })
  } catch (error) {
      console.log(error.message);
    }
  }
   
  // module.exports.widthdrawPage_post = async(req, res) =>{
  //     // const {amount, type, status, narration} = req.body
  //   try {
  //     const widthdraw = new Widthdraw({
  //     amount: req.body.amount,
  //     type: req.body.type,
  //     status: req.body.status,
  //     narration: req.body.narration
  //     });
  //     widthdraw.save()
  //     const id = req.params.id;
  //     const user = await User.findById(id)
  //     user.widthdraws.push(widthdraw);
  //     await user.save()
  
  //     res.render("widthdrawHistory", {user})
  //         if(user){
  //             widthdrawEmail(req.body.amount,req.body.type, req.body.narration )
  //         }else{
  //             console.log(error)
  //         }
   
  //   } catch (error) {
  //     console.log(error)
  //   }
  
  // }

//     // Import necessary libraries
// const express = require('express');
// const mongoose = require('mongoose');

// // Initialize Express app
// const app = express();

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/bank', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));

// // Define User schema
// const userSchema = new mongoose.Schema({
//   username: String,
//   balance: { type: Number, default: 0 }
// });

// const User = mongoose.model('User', userSchema);

// // Withdrawal controller
// app.post('/withdraw', async (req, res) => {
//   const { userId, amount } = req.body;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     if (user.balance === 0 || user.balance < amount) {
//       return res.status(400).json({ error: 'Insufficient balance' });
//     }

//     // Proceed with withdrawal
//     user.balance -= amount;
//     await user.save();

//     return res.status(200).json({ message: 'Withdrawal successful', newBalance: user.balance });
//   } catch (error) {
//     console.error('Error occurred:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)

    module.exports.widthdrawPage_post = async(req, res) =>{
      const { amount, type, status, wallet} = req.body
   
    try {
            const widthdraw = new Widthdraw({
                  amount: req.body.amount,
                  wallet: req.body.wallet,
                  type: req.body.type,
                  status: req.body.status,
                 });
            // Proceed with withdrawal
            const id = req.params.id;
            const user = await User.findById( id);
             user.widthdraws.push(widthdraw)
            await user.save();
            res.render("widthdrawHistory",{user})
            // if(user){
            //      widthdrawEmail(req.body.amount,req.body.type, req.body.narration )
            //    }else{
            //       console.log(error)
            //     }
    } catch (error) {
      console.log(error)
    }

  }

  module.exports.widthdrawHistory = async(req, res) =>{
    const id = req.params.id
      const user = await User.findById(id).populate("widthdraws")
       res.render('widthdrawHistory')
  }
  

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}




