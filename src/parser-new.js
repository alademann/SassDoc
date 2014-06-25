var LINE_BREAK = "\n";
var SPACE = " ";
var TAB = " ";
var LBRACE = "{";
var RBRACE = "}";
var LPAREN = "(";
var RPAREN = ")";
var LBRACK = "[";
var RBRACK = "]";

var parser = {
  pointer: 0,
  doc: {
    'name':          '',
    'description':   '',
    'param':         [],
    'throws':        [],
    'todo':          [],
    'link':          [],
    'requires':      [],
    'aliased':       [],
    'type':          false,
    'alias':         false,
    'since':         false,
    'deprecated':    false,
    'author':        false,
    'access':        'public',
    'returns': {
      'type':        false,
      'description': false
    }
  },
  string: "// Item description\n\
// spawning on several lines\n\
// @access private\n\
// @deprecated\n\
// @since 1.0.0\n\
// @author Test\n\
// @alias other_function\n\
// @throws Oh shit!\n\
// @throws Oh God!\n\
// @requires this\n\
// @requires that\n\
// @ignore this line\n\
// @link http://google.com label\n\
// @todo this\n\
// @todo that\n\
// @returns {type} description\n\
// @param {bool} $bool\n\
// @param {color} $color (red)\n\
// @param {number} $number - this is a number\n\
// @param {string} $string (default value) - this is a string",

  /**
   * Initialize parsing
   * @return {Object} Documented object
   */
  run: function () {
    var character;

    while (this.pointer <= this.string.length) {
      // Storing current character before moving on
      character = this.current();

      // Moving pointer to next character
      this.next();

      // Trim leading spaces
      if (character === SPACE || character === TAB) {
        //this.trim();
      }

      // If character is a /, consume next /
      else if (character === "/") {
        this.consume("/");
      }

      // If character is a @, parse token
      else if (character === "@") {
        this.captureAnnotation(this.getUntil([SPACE, LINE_BREAK]));
      }

      // Else, just move on
      else {
        this.previous();
        this.doc.description += LINE_BREAK + this.getUntil(LINE_BREAK);
      }
    }

    this.doc.description.substring(1);
    return this.doc;
  },

  /**
   * Returns current character
   * @return {String} - Current character
   */
  current: function () {
    return this.string.charAt(this.pointer)
  },

  /**
   * Move pointer to the right
   */
  next: function () {
    this.pointer++;
  },

  /**
   * Move pointer to the left
   */
  previous: function () {
    this.pointer--;
  },

  /**
   * Consume token or throw error
   * @param  {String} token - Token to be consumed
   * @throws Invalid token `token`
   */
  consume: function (token) {
    if (this.current() !== token) {
      throw "Invalid token `" + this.current() + "`.";
    }

    this.next();
  },

  /**
   * Consume any leading space
   */
  trim: function () {
    while (this.current() === " ") {
      this.next();
    }
  },

  /**
   * Consume and return all characters until any of [tokens]
   * @param  {Array} tokens - Tokens stopping the capture
   */
  getUntil: function (tokens) {
    var value = "";

    while (this.pointer <= this.string.length) {

      if (tokens.indexOf(this.current()) === -1) {
        value += this.current();
      }

      else {
        this.next();
        return value;
      }

      this.next();
    }

    return value;
    throw "Unexpected end of stream.";
  },

  /**
   * Capture annotation and defer treatment to a specific function
   * @param  {String} annotation
   */
  captureAnnotation: function (annotation) {
    this.trim();

    switch (annotation) {
      case "access":
      case "since":
      case "alias":
      case "author":
        this.captureSimple(annotation);
        break;

      case "requires":
      case "require":
      case "throws":
      case "exception":
      case "todo":
        this.captureArray(annotation);
        break;

      case "ignore":
        break;

      case "deprecated":
        this.captureDeprecated();
        break;

      case "param":
      case "arg":
      case "argument":
        this.captureParam();
        break;

      case "link":
        this.captureLink();
        break;

      case "return":
      case "returns":
        this.captureReturn();
        break;

      case "var":
        this.captureVar();
        break;
    }
  },

  /**
   * Capture a simple value
   * @param  {String} key
   */
  captureSimple: function (key) {
    var value = this.getUntil(LINE_BREAK);
    this.doc[key] = value;
  },

  /**
   * Capture an array value
   * @param  {String} key
   */
  captureArray: function (key) {
    var value = this.getUntil(LINE_BREAK);
    console.log(key);
    console.log(this.doc[key]);
    this.doc[key].push(value);
  },

  /**
   * Capture deprecated flag
   */
  captureDeprecated: function () {
    this.doc.deprecated = true;
  },

  /**
   * Capture a parameter
   */
  captureParam: function () {
    var type, name, defaultValue, description;

    this.trim();
    this.consume(LBRACE);
    type = this.getUntil(RBRACE);

    this.trim();
    this.consume('$');
    name = this.getUntil([SPACE, LINE_BREAK]);

    if (this.current() === LPAREN) {
      this.trim();
      this.consume(LPAREN);
      defaultValue = this.getUntil(RPAREN);
    }

    this.trim();

    if (this.current() === "-") {
      this.consume("-");
    }

    this.trim();

    description = this.getUntil(LINE_BREAK);

    this.doc.param.push({
      type: type,
      name: name,
      defaultValue: defaultValue,
      description: description
    });
  },

  /**
   * Capture a return flag
   */
  captureReturn: function () {
    this.consume(LBRACE);
    var type = this.getUntil(RBRACE);
    this.trim();
    var description = this.getUntil(LINE_BREAK);

    this.doc.returns.type = type;
    this.doc.returns.description = description;
  },

  /**
   * Capture a link
   */
  captureLink: function () {
    var url = this.getUntil(SPACE);
    var label = this.getUntil(LINE_BREAK);

    this.doc.link.push({
      url: url,
      label: label
    });
  }

};

console.log(parser.run());