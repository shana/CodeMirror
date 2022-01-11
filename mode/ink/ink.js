// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../../addon/mode/simple"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../../addon/mode/simple"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

var divertObj = {regex: /(\s*)(->|<-)(\s*)/, token: [null, "opdivert", null], next: "divert"};
var tagObj = {regex: /(#)(\s*)(.*)$/, token: ["optag", null, "tag-1"], next: "start"};
var glueObj = {regex: /<>/, token: "opglue"};
var textSimpleObj = {regex: /(.+?)(?=<>|#|->|<-)/, token: "text"};

CodeMirror.defineSimpleMode("ink", {
  // The start state contains the rules that are initially used
  start: [
    {regex: /\s*\/\/.*$/, token: "comment"},
    {regex: /\s*\/\*/, token: "comment", next: "comment"},

    {regex: /(\s*)(TODO\s*:)(.*)$/, token: [null, "optodo", "todo"]},

    // knot
    {regex: /(\s*)([=]{2,})(\s*)/, token: [null, "opknot", null], next: "knot"},
    // stitch
    {regex: /(\s*)([=]{1})(\s*)/, token: [null, "opstitch", null], next: "stitch"},
    // divert
    divertObj,

    {regex: /(\s*)(\+|\*)/, token: [null, "opchoice"], next: "choice"},

    tagObj,
    glueObj,
    textSimpleObj,
    {regex: /.*$/, token: "text"},
  ],
  // The multi-line comment state.
  comment: [
    {regex: /.*\*\/\s*$/, token: "comment", next: "start"},
    {regex: /.*/, token: "comment"}
  ],
  knot: [
    {regex: /function/, token: "function"},
    {regex: /(\w+)(\s*)([=]*)$/, token: ["knot", null, "opknot"], next: "start"},
  ],
  stitch: [
    {regex: /\w+\s*$/, token: "stitch", next: "start"},
  ],
  divert: [
    {regex: /DONE\s*$/, token: "end", next: "start"},
    {regex: /END\s*$/, token: "end", next: "start"},
    {regex: /\w+\s*$/, token: "knot", next: "start"},
  ],
  choice: [
    {regex: /(\s*)(\[)(.*)(\])/, token: [null, "opchoice", "choice", "operator"]},
    divertObj,   
    tagObj,
    glueObj,
    {regex: /(.+?)(?=<>|#|->|<-|\[)/, token: "text"},
    {regex: /.*$/, token: "text", next: "start"},
  ],
  text: [
    divertObj,
    tagObj,
    glueObj,
    textSimpleObj,
    {regex: /.*$/, token: "text", next: "start"},
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "//"
  }
});

  CodeMirror.defineMIME("text/x-ink", "ink");
});
