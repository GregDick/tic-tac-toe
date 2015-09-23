var secrets = {
  AWS_RDS_USER : 'VtBoc3KjJf2ScK7',
  AWS_RDS_PASS : 'c0vhCyH8ODQLvhk'
}

if (process.env.NODE_ENV === 'production'){
  secrets.POSTGRES_URL = 'postgres://' +
  secrets.AWS_RDS_USER + ':' +
  secrets.AWS_RDS_PASS + '@tictactoedb.cy1rbtcrn48n.us-east-1.rds.amazonaws.com:5432/tictactoe';
}



Object.keys(secrets).forEach(function (key){
  process.env[key] = process.env[key] || secrets.key;
})
