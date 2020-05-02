module.exports = {
    JWTsecret: process.env.JWTsecret || 'wd#o,9!fPJZ-> L<~%J-VEVGdnlr6(Gq2dq).XHOpQ^v[q4t1^-%Nq ff-jn_s=g',
    JWTexpiresIn: process.env.JWTexpiresIn || 86000,
    aws_region: process.env.aws_region || 'us-east-2',
    sqs_url: process.env.sqs_url || 'https://sqs.us-east-2.amazonaws.com/453390648714/Reminders-Queue'
}