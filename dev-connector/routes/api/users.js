const express = require('express');

const router = express.Router();

//@route GET api/user
//@desc Register user
//Access Public

router.get('/', (req, res) => {
  console.log(req.body);
  res.send('User route');
});

module.exports = router;
