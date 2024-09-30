module.exports = func => {// this func
  return (req, res, next) => { // returns a func
    func(req, res, next).catch(next); // executes that function
  } // passes errors to next
}