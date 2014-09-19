/* global describe, it */
'use strict';

var assert = require('assert');

describe('#output', function () {
  var output = require('../../src/annotation').output;

  it('should parse an output description', function () {
    assert.deepEqual(output.parse('position'), 'position');
  });

  it('should parse include linebreaks', function () {
    assert.deepEqual(output.parse('one\ntwo\nthree'), 'one\ntwo\nthree');
  });

});
