const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8046;

/**
 * Example of a different API
 *
 * You can copy the ideas here to write your own API.
 *
 * This is an example of a random number generator.  There are two API
 * requests:
 *
 * POST /test/maximum
 *
 *    The data is a JSON-encoded maximum for the random number generator, and
 *    this call sets the maximum to that value.
 *
 * GET /test/maximum
 *
 *    Get the current maximum..
 *
 * GET /test/random
 *
 *    Return a random number.
 */

var maxRandom = 10;

// For POST requests, parse the JSON-encoded body.  The result is stored
// in req.body. See POST "/test/maximum" example, below.
//
app.use(bodyParser.json());

// Example POST request with a JSON-encoded body.  The body is parsed into
// req.body (see above).
//
app.post("/test/maximum", function(req, res) {
   if ( req.body
        && req.body.hasOwnProperty("maximum")
        && Number.isInteger(req.body.maximum)
        && 0 < req.body.maximum ) {
      maxRandom = req.body.maximum;
      console.log("setting maximum to", maxRandom);
      res.send(`server... ok, setting maximum: ${maxRandom}\n`);
   }
   else {
      res.status(400).send("bad request (invalid maximum value)\n");
   }
});

app.get("/test/maximum", function(req, res) {
   response = { maximum: maxRandom };
   res.send(JSON.stringify(response));
});

// Example GET request (including handling an error case).
//
app.get("/test/random", function(req, res) {
   if (maxRandom <= 0) {
      res.status(400).send("bad request (maximum not set)\n");
   }
   else {
      var r = Math.floor(Math.random() * maxRandom);
      console.log("server... sending random:", r);
      res.send(JSON.stringify(r) + "\n");
   }
});

/**
 * Serve static files from the directory ./static.
 *
 * Just "index.html" is served from here.
 *
 * You don't have to do anything here, apart from ensuring that the
 * asciidoc file in the static directory has been compiled to HTML.
 */

app.use(express.static('./static'));

/* RPN calculator API.
 *
 * Javascript tips:
 *
 *   - Look carefully at the examples above.  Much of what you need to do
 *     can be achieved by copying and tweaking that code.
 *
 *   - You will need these:
 *       stack = stack.concat(values)
 *       stack.length (length of array "stack", like len(stack) in Python)
 *       value = stack.pop()
 *       stack.push(value)
 *
 *   - For the /push request, the JSON body will already have been parsed by
 *     the body parser above.  You don't need to do anything special.  Just
 *     verify that req.body.values exists.
 *
 * The details of the required API are defined in static/index.(ascii|html).
 */

var stack = [];

/**
 * (You shouldn't have to change anything ABOVE here.)
 */

app.post("/push", function(req, res) {
   if ( req.body
        && req.body.hasOwnProperty("values")) {
      stack = stack.concat(req.body.values);
      res.send(`server... ok, setting values: ${stack}\n`);
   }
   else {
      res.status(400).send("bad request\n");
   }
});

app.get("/pop", function(req, res) {
   if (stack.length == 0) {
      res.status(400).send("bad request (stack is empty)\n");
   }
   else {
      res.send(JSON.stringify(stack.pop()));
   }
});

app.get("/length", function(req, res) {
   res.send(JSON.stringify(stack.length));
});

app.get("/peek", function(req, res) {
   res.send(JSON.stringify(stack[stack.length - 1]));
});

app.get("/add", function(req, res) {
   if (eval(stack.length) < 2) {
      res.status(400).send("bad request (stack has less than 2 elements)\n");
   }
   else {
      value = stack.pop();
      value2 = stack.pop();
      new_value = value2 + value;
      stack.push(new_value);
      console.log("adding", value2, "and", value);
      res.send(JSON.stringify(new_value));   }
});

app.get("/subtract", function(req, res) {
   if (stack.length < 2) {
      res.status(400).send("bad request (stack has less than 2 elements)\n");
   }
   else {
      value = stack.pop();
      value2 = stack.pop();
      new_value = value2 - value;
      stack.push(new_value);
      console.log("subtracting", value, "from", value2);
      res.send(JSON.stringify(new_value));   }
});

app.get("/multiply", function(req, res) {
   if (stack.length < 2) {
      res.status(400).send("bad request (stack has less than 2 elements)\n");
   }
   else {
      value = stack.pop();
      value2 = stack.pop();
      new_value = value2 * value;
      stack.push(new_value);
      console.log("multiplying", value2, "by", value);
      res.send(JSON.stringify(new_value));
   }
});

app.get("/divide", function(req, res) {
   if (stack.length < 2) {
      res.status(400).send("bad request (stack has less than 2 elements)\n");
   }
   else {
      value = stack.pop();
      value2 = stack.pop();
      new_value = value2 / value;
      stack.push(new_value);
      console.log("dividing", value2, "by", value);
      res.send(JSON.stringify(new_value));
   }
});

/**
 * Start the server on the indicated port.
 *
 * (You shouldn't have to change anything BELOW here.)
 */

app.listen(port, function() {
   console.log("listening on port", port);

   /**
    * Now, the server is running on "port".
    *
    * Next, if there is a command-line argument, then we'll run that
    * as a test target via make, and then exit.
    *
    * This simplifies testing because something like this:
    *
    *    $ node index.js users-tests
    *
    * or:
    *
    *    $ make run-user-tests
    *
    * starts the server, runs the tests, and stops the server again.
    */

   switch ( process.argv.length ) {
      case 2:
	 // OK.  There's nothing to do here.  Just leave the server running.
	 break;
      case 3:
	 console.log("launching tests: make", process.argv[2]);
	 runTest(process.argv[2]);  // This exits when it's done.
	 break;
      default:
	 // This is an error.
	 console.error("invalid arguments");
	 process.exit(1);
   }
});

/**
 * Launch a child process to run make, copying its output (stdout and stderr) to
 * our output.
 *
 * On "close", exit with whatever exit code the child process exited with.
 */

var childProcess = require("child_process");

runTest = function(target) {
   make = childProcess.spawn("make", [target]);

   make.stdout.on("data", function(data) {
      console.log(data.toString().trimEnd());
   });

   make.stderr.on("data", function(data) {
      console.error(data.toString().trimEnd());
   });

   make.on("close", function(code) {
      process.exit(code);
   });
}
