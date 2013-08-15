/*global describe, it, before, after, beforeEach, afterEach*/


'use strict';

var assert = require('assert');

var ArgumentParser = require('../lib/argparse').ArgumentParser;

describe('ArgumentParser', function () {
  describe('sub-commands', function () {
    var parser;
    var args;

    beforeEach(function() {
      parser = new ArgumentParser({debug: true});
      var subparsers = parser.addSubparsers({
        title:'subcommands',
        dest:"subcommand_name"
      });
      var c1 = subparsers.addParser('c1', {aliases:['co']});
      c1.addArgument([ '-f', '--foo' ], {});
      c1.addArgument([ '-b', '--bar' ], {});
      var c2 = subparsers.addParser('c2', {});
      c2.addArgument([ '--baz' ], {});
    });

    it("shold store command name", function(){
      args = parser.parseArgs('c1 --foo 5'.split(' '));
      assert.equal(args.subcommand_name, 'c1');
    });

    it("shold store command arguments", function(){
      args = parser.parseArgs('c1 --foo 5 -b4'.split(' '));
      assert.equal(args.foo, 5);
      assert.equal(args.bar, 4);
    });

    it("shold have same behavior for alias and original command", function(){
      args = parser.parseArgs('c1 --foo 5 -b4'.split(' '));
      var aliasArgs = parser.parseArgs('co --foo 5 -b4'.split(' '));
      assert.equal(args.foo, aliasArgs.foo);
      assert.equal(args.bar, aliasArgs.bar);
    });

    it("shold have different behavior for different commands", function(){
      assert.doesNotThrow(function() {parser.parseArgs('c1 --foo 5 -b4'.split(' ')); });
      assert.throws(function () {parser.parseArgs('c2 --foo 5 -b4'.split(' ')); });
      assert.doesNotThrow(function () {parser.parseArgs('c2 --baz 1'.split(' ')); });
      assert.throws(function () {parser.parseArgs('c1 --baz 1'.split(' ')); });
    });

    it("shoud drop down with 'unknown parser' error if parse unrecognized command", function(){
      assert.throws(
        function () {parser.parseArgs('command --baz 1'.split(' ')); },
        /Unknown parser/
      );
    });

    it("shoud drop down with empty args ('too few arguments' error)", function(){
      assert.throws(
        function () {parser.parseArgs([]); },
        /too few arguments/
      );
    });
  });
});
