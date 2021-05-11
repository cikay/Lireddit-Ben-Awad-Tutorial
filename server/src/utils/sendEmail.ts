'use strict'
import nodemailer from 'nodemailer'
/*
user: 'zzbehrd4ulrojvzd@ethereal.email',
  pass: 'rs2KUZA1xZf9PVTrrG',



/*
  user: 'fil5ssq52fe2yg7e@ethereal.email',
  pass: 'FVbHge3JNfU2YZjzWD',
*/
export async function sendEmail(to: string, text: string) {
  // if (!testAccount) {
  //   testAccount = await nodemailer.createTestAccount()
  // }
  // console.log('test account', testAccount)
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'fil5ssq52fe2yg7e@ethereal.email', // generated ethereal user
      pass: 'FVbHge3JNfU2YZjzWD', // generated ethereal password
    },
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to,
    subject: 'Change password', // Subject line
    html: text, // plain text body
  })

  console.log('Message sent: %s', info.messageId)

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
