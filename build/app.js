(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/** @jsx React.DOM */
Marked = require('marked');

_users = require('./models/users.js');
STRINGS = require('./models/strings.js')
Utils = require('./utils/utils.js');
getTimeFromRange = Utils.getTimeFromRange;
TableOfContents = require('./views/TableOfContents.jsx');

PrecallNotSignedIn = require('./views/PrecallNotSignedIn.jsx');
PrecallNotSignedInQuick = require('./views/PrecallNotSignedInQuick.jsx');
PrecallNotSignedInFirstRun = require('./views/PrecallNotSignedInFirstRun.jsx');
PrecallSignedIn = require('./views/PrecallSignedIn.jsx');
PrecallSignedInQuick = require('./views/PrecallSignedInQuick.jsx');
CallHistory = require('./views/CallHistory.jsx');
InvitationManagement = require('./views/InvitationManagement.jsx');
InCallActive = require('./views/InCallActive.jsx');
InCallActiveAudio = require('./views/InCallActiveAudio.jsx');
ContactsDocked = require('./views/ContactsDocked.jsx');
ContactsView = require('./views/ContactsView.jsx');
IncomingCallView = require('./views/IncomingCallView.jsx');
IncomingCallUnknownView = require('./views/IncomingCallUnknownView.jsx');
OutgoingCallView = require('./views/OutgoingCallView.jsx');

moment.lang('en', {
  calendar : {
    lastDay : '[Yesterday at] LT',
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    lastWeek : 'l [at] LT',
    nextWeek : 'l [at] LT',
    sameElse : 'L'
  }
});

var states = [
  {
    name: 'Precall (First Run)',
    view: PrecallNotSignedInFirstRun,
    tab: 0,
    slug: 'precall-firstrun'
  },
  {
    name: 'Precall (Not Signed In)',
    view: PrecallNotSignedInQuick,
    tab: 0,
    slug: 'precall'
  },
  {
    name: 'Precall (Signed In)',
    view: PrecallSignedInQuick,
    tab: 0,
    slug: 'precall-signedin'
  },
  {
    name: 'Contacts',
    view: ContactsView,
    tab: 2,
    slug: 'contacts'
  },
  {
    name: 'Call History',
    view: CallHistory,
    tab: 1,
    slug: 'callhistory'
  },
  {
    name: 'In Call (Video)',
    view: InCallActive,
    tab: 1,
    slug: 'call-active'
  },
  {
    name: 'In Call (Audio)',
    view: InCallActiveAudio,
    tab: 1,
    slug: 'call-active-audio'
  },
  {
    name: 'Incoming Call',
    view: IncomingCallView,
    tab: 1,
    slug: 'call-incoming'
  },
  {
    name: 'Incoming Call (Link)',
    view: IncomingCallUnknownView,
    tab: 1,
    slug: 'call-incoming-unknown'
  },
  {
    name: 'Outgoing Call',
    view: OutgoingCallView,
    tab: 1,
    slug: 'call-outgoing'
  }
];

setTimeout(function(){
  React.renderComponent(TableOfContents( {items:states} ), $('#toc')[0]);
  _.each(states, function(state, index){

      var el = $('<div/>', {
        class: 'component-wrapper',
        id: state.slug
      })[0];

      $('#wrapper').append(el);

      var View = state.view
      $.get('./notes/' + state.slug + '.md').success(function(data){
        React.renderComponent(View( {items:_users, index:index, tab:state.tab, name:state.name} ), el);
        var notes = Marked(data);
        $(el).append($('<div/>', {
          class: 'Notes'
        }).html(notes));
      })


  })
  $('.tip').tipr({
    mode: 'top',
    speed: 200
  });

  $('.TableOfContents').ddscrollSpy({
    scrollduration: 0
  });
}, 100);

},{"./models/strings.js":3,"./models/users.js":4,"./utils/utils.js":6,"./views/CallHistory.jsx":14,"./views/ContactsDocked.jsx":15,"./views/ContactsView.jsx":16,"./views/InCallActive.jsx":21,"./views/InCallActiveAudio.jsx":22,"./views/IncomingCallUnknownView.jsx":25,"./views/IncomingCallView.jsx":26,"./views/InvitationManagement.jsx":28,"./views/OutgoingCallView.jsx":32,"./views/PrecallNotSignedIn.jsx":35,"./views/PrecallNotSignedInFirstRun.jsx":36,"./views/PrecallNotSignedInQuick.jsx":37,"./views/PrecallSignedIn.jsx":38,"./views/PrecallSignedInQuick.jsx":39,"./views/TableOfContents.jsx":46,"marked":1}],3:[function(require,module,exports){
module.exports = {
  viewAccount: "View Account",
  signIn: "Sign In",
  signOut: "Sign Out",
  changeUsername: "Change",
  loggedInUsername: "ally@gmail.com",
  loggedOutUsername: "Guest",
  newCallButton: "New Invitation",
  callingAs: "Calling as",
  searchPlaceholder: "Search...",
  getLinkText: "Get Link",
  callNamePlaceholder: "Orange Prickly Badger",
  inviteExpireIn: "Invitation will expire in",
  sampleCallURL: "http://loop.dev.mozaws.net/calls/IRzK5l843AxgKTorMKh7XmhR0QzkSNvuVJVD7ZWpeYjzVWe6BhRPYfd6M5mdTDguvP0QXO0pnd-Ac23-ufDtoKUkvaIUZ8FSo5AHU0FBXqwtO6_ZFSwL1mX3brGHICs6xfCfJ6X0zRVRR-bzM7Bg9glFAIo",
  shareThisLinkWith: "Share this link with",
  contactManagement: "Add or Import Contacts",
  callHistory: "Call History",
  clearHistory: "Clear",
  invitationList: "Your Invitations",
  expired: "Expired",
  endCall: "Hang Up"
};

},{}],4:[function(require,module,exports){
module.exports = [
  {
    name: 'Ally Avocado',
    email: 'ally@mail.com',
    index: 0,
    isGoogle: true
  },
  {
    name: 'Bob Banana',
    email: 'bob@gmail.com',
    index: 1,
    isGoogle: false
  },
  {
    name: 'Caitlin Cantaloupe',
    email: 'caitlin.cant@hotmail.com',
    index: 2,
    isGoogle: false
  },
  {
    name: 'Dave Dragonfruit',
    email: 'dd@dragons.net',
    index: 3,
    isGoogle: true
  },
  {
    name: 'Ellie Eggplant',
    email: 'ellie@yahoo.com',
    index: 4,
    isGoogle: true
  }
];
},{}],5:[function(require,module,exports){
module.exports = {
  animation: {
    duration: 200,
    easing: "easeInSine",
    queue: false
  }
}


},{}],6:[function(require,module,exports){
module.exports = {

  getTimeFromRange: function(position) {
    var minp = 1;
    var maxp = 100;

    var minv = Math.log(60);
    var maxv = Math.log(44640);

    var scale = (maxv-minv) / (maxp-minp);
    var scaled = Math.exp(minv + scale*(position-minp));

    var dur = moment.duration(scaled, 'minutes');
    if(dur.asMinutes() > 60*24)
    {
      var num = parseInt(dur.asDays(), 10);
      var plural = num > 1 ? 's' : '';
      return  num + ' day' + plural;
    } else {
      var num = parseInt(dur.asHours(), 10) + 1;
      var plural = num > 1 ? 's' : '';
      return  num + ' hour' + plural;
    }
  }

}


},{}],7:[function(require,module,exports){
/** @jsx React.DOM */
CallControls = require('./CallControls.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"AudioCall"}, 
        CallControls(null),
        React.DOM.div( {className:"AudioScreen"})
      )
    )
  }
});

},{"./CallControls.jsx":13}],8:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {onClick:this.props.onClick, className:"BackButton"}, 
        React.DOM.i( {className:"fa fa-chevron-left"})
      )
    )
  }
});
},{}],9:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  getDefaultProps: function(){
    return {
      name: 'Base State',
      children: [],
      index: 1
    }
  },
  render: function(){
    return (
      React.DOM.div( {className:"StateWrapper"}, 
        React.DOM.h3( {className:"higher"}, React.DOM.span( {className:"counter"},  this.props.index + 1 ), " ",  this.props.name ),
        React.DOM.div( {className:"Toolbar"}, React.DOM.i( {className:"fa fa-comment-o"})),
        React.DOM.div( {className:"PanelWrapper"}, 
           this.props.children 
        )
      )
    )
  }
});
},{}],10:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  getDefaultProps: function(){
    return {
      name: 'Base State',
      children: [],
      index: 1
    }
  },
  render: function(){
    return (
      React.DOM.div( {className:"StateWrapper"}, 
        React.DOM.h3(null, React.DOM.span( {className:"counter"},  this.props.index + 1 ), " ",  this.props.name ),
        React.DOM.div( {className:"Browser"}, 
          React.DOM.div( {className:"WindowWrapper"}, 
             this.props.children 
          )
        )
      )
    )
  }
});
},{}],11:[function(require,module,exports){
/** @jsx React.DOM */
SearchBar = require('./SearchBar.jsx');
Profile = require('./Profile.jsx');
ProfileDetail = require('./ProfileDetail.jsx');
Button = require('./Button.jsx');
Defaults = require('../utils/defaults');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function(){
    return {
      filterText: '',
      selectedIndex: -1,
      isOpen: false
    }
  },
  handleChange: function(){
    this.setState(
      {
        filterText: this.refs.filterSearchBar.refs.searchInput.getDOMNode().value,
        selectedIndex: 0
      }
    );
  },
  openPanel: function(){
    $(this.refs.listSlider.getDOMNode()).velocity({
      translateX: '-50%'
    }, Defaults.animation);
  },
  closePanel: function(){
    $(this.refs.listSlider.getDOMNode()).velocity({
      translateX: '0'
    }, Defaults.animation);
  },
  togglePanel: function(e){
    this.setState({
      isOpen: !this.state.isOpen
    });

    if(!this.state.isOpen) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  },
  render: function(){
    var onClick = function(idx){
      this.setState(
        {
          selectedIndex: idx
        }
      );
    }.bind(this);

    var viewForItem = function(item, index){
      var isSelected = (this.state.selectedIndex === index) ? 'selected' : null;
      if(this.props.detail) {
        return ProfileDetail( {onClickEdit:this.togglePanel, onClick:onClick, key:index, user:item, selected:isSelected} )
      } else {
        return Profile( {onClickEdit:this.togglePanel, onClick:onClick, key:index, user:item, selected:isSelected} )
      }
    }.bind(this);

    var shownItems = this.props.items;

    if(this.state.filterText !== '')
    {
      var filter = this.state.filterText.toUpperCase();
      shownItems = _.filter(this.props.items, function(i){
        return (i.name.toUpperCase().indexOf(filter) !== -1)
      });
    }

    var contact = this.props.items[this.state.selectedIndex] || { name: '', email: ''};

    return (
      React.DOM.div( {ref:"listSlider", className:"ListPanels"}, 
        React.DOM.div( {className:"List " + (this.props.faded ? 'faded': '')}, 
            SearchBar( {isOpen:this.state.isOpen, onClick:this.togglePanel, ref:"filterSearchBar", val:this.state.filterText, handleChange:this.handleChange} ),
            React.DOM.ul( {className:"scrollable"}, 
             shownItems.map(viewForItem)
            )
        ),
        React.DOM.div( {className:"EditContact"}, 
          React.DOM.div( {className:"Header"}, "Edit Contact"),
          React.DOM.div( {className:"Form"}, 
            React.DOM.label(null, "Name"),
            React.DOM.input( {defaultValue:contact.name} ),
            React.DOM.label(null, "Email"),
            React.DOM.input( {defaultValue:contact.email} ),
            Button( {text:"Done", onClick:this.togglePanel, style:"action"})
          )
        )
      )
    )
  }
});

},{"../utils/defaults":5,"./Button.jsx":12,"./Profile.jsx":40,"./ProfileDetail.jsx":41,"./SearchBar.jsx":42}],12:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div( {onClick:this.props.onClick, className:"Button " + this.props.style },  this.props.text )
    )
  }
});
},{}],13:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"CallControls"}, 
       React.DOM.i( {className:"button end fa fa-phone"}),
       React.DOM.i( {className:"button active fa fa-video-camera"}),
       React.DOM.i( {className:"button fa fa-volume-up"}),
       React.DOM.i( {className:"button fa fa-microphone-slash"}),
       React.DOM.span( {className:"right"}, "2:45")
      )
    )
  }
});

},{}],14:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HistoryList = require('./HistoryList.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          Panel( {items: this.props.items }, 
            HistoryList(null)
          )
        )
    );
  }
});

},{"./BaseState.jsx":9,"./HistoryList.jsx":20,"./Panel.jsx":33,"./TabBar.jsx":45}],15:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
BuddyList = require('./BuddyList.jsx');
Window = require('./Window.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {items: this.props.items,  title:"Contacts"}, 
            BuddyList( {items:this.props.items} )
          )
        )
    );
  }
});
},{"./BaseStateCorner.jsx":10,"./BuddyList.jsx":11,"./Window.jsx":48}],16:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({displayName: 'exports',
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      isVisible: false
    }
  },
  openView: function(){
    $(this.refs.newContactView.getDOMNode()).css({display: 'flex'});
  },
  closeView: function(){
    $(this.refs.newContactView.getDOMNode()).hide();
  },
  toggleView: function(){
    this.setState({
      isVisible: !this.state.isVisible
    });
    if(this.state.isVisible) {
      this.closeView();
    } else {
      this.openView();
    }
  },
  componentDidMount: function(){
    this.closeView();
  },
  addContact: function(){
    this.toggleView();
    this.setState({
      name: '',
      email: ''
    });
    if(!this.state.name || !this.state.email ) return;
    var contact = {
      name: this.state.name,
      email: this.state.email
    };

    this.props.items.push(contact);
  },
  render: function() {
    return (
      BaseState( {name: this.props.name,  index: this.props.index }, 
        TabBar( {selected:this.props.tab} ),
        Panel( {extraClass:"Contacts", items: this.props.items }, 

          React.DOM.div( {className:"ContactManagement"}, 
            React.DOM.div( {className:"Header"}, 
              React.DOM.div(null, STRINGS.contactManagement)
            ),

            React.DOM.div( {className:"ContactManagementView"}, 
              
              React.DOM.div( {className:"ButtonGroup"}, 
                Button( {text:"Import Contacts", style:"default"}),
                Button( {text:"New Contact", onClick:this.toggleView, style:this.state.isVisible ? 'default-active' : 'default'})
              ),

              React.DOM.div( {className:"NewContactView", ref:"newContactView"}, 
                React.DOM.hr(null ),
                React.DOM.input( {valueLink:this.linkState('name'), placeholder:"Name"} ),
                React.DOM.input( {valueLink:this.linkState('email'), placeholder:"Email"} ),
                React.DOM.div( {className:"ButtonGroup"}, 
                  Button( {onClick:this.addContact, text:"Add Contact", style:"action"})
                )
              )
            )
          ),

          BuddyList( {faded:this.state.isVisible ? true : false, items:this.props.items, detail:"true"}),
          Footer( {linkText:STRINGS.signOut, username:STRINGS.loggedInUsername})
        )
      )
    );
  }
});

},{"./BaseState.jsx":9,"./Footer.jsx":17,"./HeaderQuick.jsx":19,"./NewCallView.jsx":29,"./Panel.jsx":33,"./TabBar.jsx":45}],17:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      isDropdownVisible: false,
      currentIcon: 'fa-circle',
      name: this.props.username,
      isEditing: false
    }
  },
  onClick: function(){
    if(this.state.isDropdownVisible) {
      $(this.refs.statusDropdown.getDOMNode()).hide();
    } else {
      $(this.refs.statusDropdown.getDOMNode()).show();
    }
    this.setState({
      isDropdownVisible: !this.state.isDropdownVisible
    });
  },
  setIcon: function(e) {
    $(this.refs.statusDropdown.getDOMNode()).hide();
    this.setState({
      currentIcon: e.currentTarget.dataset.icon,
      isDropdownVisible: false
    });
  },
  hideDropdown: function() {
    $(this.refs.statusDropdown.getDOMNode()).hide();
    this.setState({
      isDropdownVisible: false
    });
  },
  toggleInput: function() {
    this.setState({
      isEditing: !this.state.isEditing
    })
    $(this.refs.inputBox.getDOMNode()).focus();
  },
  checkKey: function(e){
    if(e.keyCode === 13) {
      this.setState({
        isEditing: false
      });
    }
  },
  render: function(){
    var linkStyle = {
      display: this.state.isEditing ? 'none' : 'block'
    };
    var inputStyle = {
      display: !this.state.isEditing ? 'none' : 'block'
    };
    return (
      React.DOM.div( {className:"Footer", onMouseLeave:this.hideDropdown}, 
        React.DOM.div(null, 
          React.DOM.div( {onClick:this.onClick, className:"status-icon"}, 
            React.DOM.i( {className:"fa " + this.state.currentIcon})
          ),
          React.DOM.ul( {ref:"statusDropdown", onMouseLeave:this.hideDropdown, className:"Dropdown"}, 
            React.DOM.li( {onClick:this.setIcon, 'data-icon':"fa-circle"}, React.DOM.i( {className:"fa fa-circle"}),"Available"),
            React.DOM.li( {onClick:this.setIcon, 'data-icon':"fa-dot-circle-o"}, React.DOM.i( {className:"fa fa-dot-circle-o"}),"Contacts Only"),
            React.DOM.li( {onClick:this.setIcon, 'data-icon':"fa-circle-o grey"}, React.DOM.i( {className:"fa fa-circle-o grey"}),"Do Not Disturb")
          ),
          React.DOM.a( {style:linkStyle, onClick:this.toggleInput}, 
            this.state.name
          ),
          React.DOM.input( {onKeyPress:this.checkKey, valueLink:this.linkState('name'), ref:"inputBox", style:inputStyle} )
        ),
        React.DOM.div( {className:"action"}, 
          this.props.linkText
        )
      )
    )
  }
})

},{}],18:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  getDefaultProps: function(){
    return {
      username: STRINGS.loggedOutUsername,
      callingAsText: STRINGS.callingAs,
      editText: STRINGS.changeUsername,
      linkText: STRINGS.signIn
    }
  },
  onClick: function() {
    $(this.getDOMNode()).trigger('PanelGroup', {type: 'toggle'});
  },
  render: function(){
    return (
      React.DOM.div( {className:"Header"}, 
        React.DOM.h6(null, 
           this.props.callingAsText,  " ", React.DOM.span( {className:"bold"}, React.DOM.a(null, this.props.username)),"."
        ),
        Button( {text:STRINGS.newCallButton, style:"action", onClick:this.onClick})
      )
    )
  }
});

},{"./Button.jsx":12}],19:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  getDefaultProps: function(){
    return {
      username: STRINGS.loggedOutUsername,
      callingAsText: STRINGS.callingAs,
      editText: STRINGS.changeUsername,
      linkText: STRINGS.signIn
    }
  },
  onClick: function() {
    $(this.getDOMNode()).trigger('PanelGroup', {type: 'toggle'});
  },
  render: function(){
    return (
      React.DOM.div( {className:"Header"}, 
        React.DOM.h6( {className:"right"}, 
          React.DOM.span( {className:"bold"}, React.DOM.a( {'data-tip':"Click to change how your name appears", className:"tip"}, this.props.username))
        )
      )
    )
  }
});

},{"./Button.jsx":12}],20:[function(require,module,exports){
/** @jsx React.DOM */
SmallProfile = require('./SmallProfile.jsx');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function(){
    return {
      numItems: 10
    }
  },
  clearList: function(){
    this.setState({
      numItems: 0
    });
  },
  render: function(){
    return (
      React.DOM.div( {className:"HistoryList"}, 
        React.DOM.div( {className:"Header"}, 
          React.DOM.div(null, STRINGS.callHistory),
          React.DOM.div( {onClick:this.clearList, className:"Button"}, STRINGS.clearHistory)
        ),
        React.DOM.ul( {className:"CallHistory"}, 
          _.range(this.state.numItems).map(function(i){
            var u = _.random(0, _users.length -1);
            var callType = _.random(0, 1) === 1 ? 'incoming' : 'outgoing';
            var missed = _.random(0, 3) === 1 ? 'missed' : 'accepted';
            var icon, callIcon;
            if(missed === 'missed') {
              icon = React.DOM.i( {className:"fa fa-times-circle"})
            } else {
              icon = React.DOM.i( {className:"fa fa-phone"})
            }
            if(callType === 'incoming') {
              callIcon = React.DOM.i( {'data-tip':"Incoming (" + missed + ")", className:"fa tip fa-arrow-right"})
            } else {
              callIcon = React.DOM.i( {'data-tip':"Outgoing (" + missed + ")", className:"fa tip fa-arrow-left"})
            }
            return (
              React.DOM.li( {key:"CallerHistory" + i, className:[callType, missed].join(' ')}, 
                callIcon,
                SmallProfile( {user:_users[u]} ),
                React.DOM.div( {className:"CallDetails right"}, 
                  "May 3 4:32pm"
                )
              )
            )
          })
        )
      )
    )
  }
});

},{"./SmallProfile.jsx":43}],21:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
VideoCall = require('./VideoCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {extraClass:"InCall", items: this.props.items,  title:"Aubrey Drake Graham"}, 
            VideoCall(null )
          )
        )
    );
  }
});

},{"./BaseStateCorner.jsx":10,"./VideoCall.jsx":47,"./Window.jsx":48}],22:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
AudioCall = require('./AudioCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {extraClass:"InCall", items: this.props.items,  title:"Aubrey Drake Graham"}, 
            AudioCall(null )
          )
        )
    );
  }
});

},{"./AudioCall.jsx":7,"./BaseStateCorner.jsx":10,"./Window.jsx":48}],23:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"IncomingCall"}, 
        React.DOM.div( {className:"avatar"}),
        React.DOM.h3(null, "Aubrey Drake Graham"),
        React.DOM.div( {className:"callTypeIcons"}, 
          React.DOM.i( {className:"fa fa-microphone active"}),
          React.DOM.i( {className:"fa fa-video-camera"})
        ),
        React.DOM.div( {className:"ButtonGroup"}, 
          Button( {text:"Ignore ▾", style:"cancel"}),
          Button( {text:"Answer", style:"action"})
        )
      )
    )
  }
});

},{"./Button.jsx":12}],24:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"IncomingCall"}, 
        React.DOM.div( {className:"avatar unknown"}),
        React.DOM.h3(null, React.DOM.i( {className:"fa fa-tag"}),"Orange Prickly Badger"),
        React.DOM.div( {className:"callTypeIcons"}, 
          React.DOM.i( {className:"fa fa-microphone active"}),
          React.DOM.i( {className:"fa fa-video-camera active"})
        ),
        React.DOM.div( {className:"ButtonGroup"}, 
          Button( {text:"Ignore ▾", style:"cancel"}),
          Button( {text:"Answer", style:"action"})
        )
      )
    )
  }
});

},{"./Button.jsx":12}],25:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
IncomingCallUnknown = require('./IncomingCallUnknown.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {items: this.props.items,  title:"Orange Prickly Badger", type:""}, 
            IncomingCallUnknown(null )
          )
        )
    );
  }
});

},{"./BaseStateCorner.jsx":10,"./IncomingCallUnknown.jsx":24,"./Window.jsx":48}],26:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
IncomingCall = require('./IncomingCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {items: this.props.items,  title:"Call from Aubrey Drake Graham", type:""}, 
            IncomingCall(null )
          )
        )
    );
  }
});

},{"./BaseStateCorner.jsx":10,"./IncomingCall.jsx":23,"./Window.jsx":48}],27:[function(require,module,exports){
/** @jsx React.DOM */
var Invitation = React.createClass({displayName: 'Invitation',
  render: function() {

    if(this.props.invite.isActive){
      var divStyle = {
        width: this.props.invite.completed*90 + '%'
      }
      return (
        React.DOM.li( {className:"Invitation active"}, 
          React.DOM.h3(null, this.props.invite.email, " ", React.DOM.small(null, "http://lo.op/8dj8d38")),
          React.DOM.div( {className:"expiryInfo"}, 
            React.DOM.h5(null, 
              React.DOM.small(null, "3:51pm May 12, 2014")
            ),
            React.DOM.div(null, 
              React.DOM.div( {className:"progressWrapper"}, 
                React.DOM.div( {className:"progressBar", style:divStyle})
              ),
              React.DOM.h5( {className:"align-right"}, React.DOM.i( {className:"fa fa-clock-o"}), " ", getTimeFromRange(this.props.invite.totalTime), " left.")
            )
          ),
          React.DOM.div( {className:"icons right"}, 
            "Revoke Invitation"
          )
        )
      )
    } else {
      return (
        React.DOM.li( {className:"Invitation expired"}, 
          React.DOM.h3(null, this.props.invite.email),
          React.DOM.div( {className:"expiryInfo"}, 
            React.DOM.h5(null, STRINGS.expired,".")
          )
        )
      )
    }
  }
});

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    var invites = _.sortBy(_.range(5).map(function(i){
      var u = _.random(0, _users.length -1);
      var isActive = _.random(0, 3) === 1 ? false : true;
      var time = _.random(0, 100);
      var completed = Math.random();
      return _.extend(_users[u], {
        totalTime: time,
        completed: completed,
        isActive: isActive
      });
    }), function(invite){
      return !invite.isActive;
    });

    var inviteView = function(inv, index){
      return (Invitation( {key:"Invite" + index, invite:inv} ))
    }.bind(this);

    return (
      React.DOM.div( {className:"InvitationList"}, 
        React.DOM.div( {className:"Header"}, 
          React.DOM.div(null, STRINGS.invitationList)
        ),
        React.DOM.ul( {className:"Invitations"}, 
           invites.map(inviteView) 
        )
      )
    )
  }
});
},{}],28:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
InvitationList = require('./InvitationList.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          Panel( {items: this.props.items }, 
            InvitationList(null)
          )
        )
    );
  }
});

},{"./BaseState.jsx":9,"./InvitationList.jsx":27,"./Panel.jsx":33,"./TabBar.jsx":45}],29:[function(require,module,exports){
/** @jsx React.DOM */
SpinnerView = require('./SpinnerView.jsx');
BackButton = require('./BackButton.jsx');
Button = require('./Button.jsx');
var linkGenerationTime = 1000;

module.exports= React.createClass({displayName: 'exports',
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      callDuration: 15,
      hasLink: false,
      gettingLink: false,
      callName: ''
    }
  },
  onClick: function() {
    if(this.state.callName == '') {
      $(this.refs.callerNameInput.getDOMNode()).addClass('error').focus();
      return;
    }
    var view = this;
    view.setState({
      gettingLink: true
    });
    this.timer = setTimeout(function(){
      view.setState({
        hasLink: true,
        gettingLink: false
      });
    }, linkGenerationTime);
  },
  componentDidUpdate: function(){
    if(this.state.callName != '' && !this.state.hasLink && !this.state.gettingLink) {
      $(this.refs.callerNameInput.getDOMNode()).removeClass('error');
    }
  },
  goBack: function(){
    $(this.getDOMNode()).trigger("PanelGroup", {type: "back"});
    this.cancelCall();
  },
  cancelCall: function() {
    clearTimeout(this.timer);
    this.setState({
      hasLink: false,
      gettingLink: false,
      callName: '',
      callDuration: 15
    });
  },
  render: function(){
    var linkSection;
    if(this.state.hasLink) {
      return (
        React.DOM.div( {className:"NewCallView"}, 
          BackButton( {onClick:this.goBack}),
          React.DOM.h3(null, STRINGS.shareThisLinkWith, " ",  this.state.callName ),
          React.DOM.input( {value:STRINGS.sampleCallURL}),
          React.DOM.h5(null, React.DOM.i( {className:"fa fa-clock-o"}), " Expires in ",  getTimeFromRange(this.state.callDuration) ),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Copy", style:"default"}),
            Button( {text:"Share", style:"default"}),
            Button( {onClick:this.cancelCall, text:"Cancel", style:"cancel"})
          )
        )
      )
    } else if (this.state.gettingLink) {
      return (
        React.DOM.div( {className:"NewCallView"}, 
          BackButton( {onClick:this.goBack}),
          React.DOM.h3( {className:"center"}, "Generating Invitation for ",  this.state.callName ),
          SpinnerView(null ),
          Button( {onClick:this.cancelCall, text:"Cancel", style:"cancel"})
        )
      )
    } else {
      return (
        React.DOM.div( {className:"NewCallView"}, 
          BackButton( {onClick:this.goBack}),
          React.DOM.h3(null, "New Invitation"),
          React.DOM.input( {ref:"callerNameInput", valueLink:this.linkState('callName'), placeholder:STRINGS.callNamePlaceholder}),
          React.DOM.h5(null, React.DOM.i( {className:"fa fa-clock-o"}), " ", STRINGS.inviteExpireIn, " ",  getTimeFromRange(this.state.callDuration), "."),
          React.DOM.input( {valueLink:this.linkState('callDuration'), type:"range", name:"time", min:"1", max:"100"}),
          Button( {onClick:this.onClick, style:"action", text:STRINGS.getLinkText})
        )
      )
    }
  }
});
},{"./BackButton.jsx":8,"./Button.jsx":12,"./SpinnerView.jsx":44}],30:[function(require,module,exports){
/** @jsx React.DOM */
SpinnerView = require('./SpinnerView.jsx');
Button = require('./Button.jsx');
var linkGenerationTime = 1000;

module.exports= React.createClass({displayName: 'exports',
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      callDuration: 15,
      callName: STRINGS.callNamePlaceholder,
      isCustomizing: false,
      copyText: 'Copy',
      customizeText: 'Customize',
      arrow: '▸'
    }
  },
  onClick: function() {
    $(this.refs.customizePanel.getDOMNode()).toggleClass('opened');
    this.setState({
      isCustomizing: !this.state.isCustomizing
    })
  },
  componentDidUpdate: function(){
    if(this.state.callName != '') {
      $(this.refs.callerNameInput.getDOMNode()).removeClass('error');
    }
  },
  cancelCall: function() {
    clearTimeout(this.timer);
    this.setState({
      isCustomizing: false,
      callName: '',
      callDuration: 15
    });
  },
  copied: function(){
    this.setState({
      copyText: 'Copied!'
    });
  },
  render: function(){
    var linkSection;
      return (
        React.DOM.div( {className:"NewCallView Quick"}, 
          React.DOM.h3(null, "Share this link to invite someone to talk:"),
          React.DOM.div( {className:"inputControls"}, 
            React.DOM.input( {value:STRINGS.sampleCallURL}),
            React.DOM.span( {onClick:this.onClick}, React.DOM.i( {className:"fa fa-cog " + this.state.isCustomizing}))
          ),
          React.DOM.p( {className:"label"}, React.DOM.i( {className:"fa fa-tag"}), " ",  this.state.callName,  " ", React.DOM.small(null, "(What is this?)")),
          React.DOM.div( {className:"Customize", ref:"customizePanel"}, 
            React.DOM.h5(null, "Invitation Name"),
            React.DOM.input( {ref:"callerNameInput", valueLink:this.linkState('callName')}),
            React.DOM.h5(null, React.DOM.i( {className:"fa fa-clock-o"}), " ", STRINGS.inviteExpireIn, " ",  getTimeFromRange(this.state.callDuration), "."),
            React.DOM.input( {valueLink:this.linkState('callDuration'), type:"range", name:"time", min:"1", max:"100"})
          ),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Share", style:"default"}),
            Button( {text:this.state.copyText, onClick:this.copied, style:"default"})
          )
        )
      )
  }
});

},{"./Button.jsx":12,"./SpinnerView.jsx":44}],31:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function(){
    return {
      isConnecting: true,
      states: [
        'connecting',
        'ringing',
        'failed'
      ],
      currentState: 0
    }
  },
  componentDidMount: function(){
    setInterval(function(){
      var s = this.state.currentState;
      s += 1;
      if (s > this.state.states.length-1) s = 0;
      this.setState({
        currentState: s
      })
    }.bind(this), 4000);
  },
  render: function(){
    var s = this.state.states[this.state.currentState];
    if(s == 'connecting'){
      return (
        React.DOM.div( {className:"OutgoingCall"}, 
          React.DOM.div( {className:"avatar"}),
          React.DOM.h3(null, "Kanye West"),
          React.DOM.div( {className:"loading"}),
          React.DOM.h6(null, "Connecting..."),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Cancel", style:"default"})
          )
        )
      )
    } else if(s == 'ringing') {
      return (
        React.DOM.div( {className:"OutgoingCall"}, 
          React.DOM.div( {className:"avatar"}),
          React.DOM.h3(null, "Kanye West"),
          React.DOM.div( {className:"loading"}),
          React.DOM.h6(null, "Ringing..."),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Cancel", style:"default"})
          )
        )
      )
    } else if(s == 'failed') {
      return (
        React.DOM.div( {className:"OutgoingCall"}, 
          React.DOM.div( {className:"avatar"}),
          React.DOM.h3(null, "Kanye West"),
          React.DOM.div( {className:"loading failed"}),
          React.DOM.h6(null, "Call Failed"),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Cancel", style:"default"}),
            Button( {text:"Retry", style:"action"})
          )
        )
      )
    }
  }
});

},{"./Button.jsx":12}],32:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
OutgoingCall= require('./OutgoingCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {items: this.props.items,  title:"Kanye West", type:""}, 
            OutgoingCall(null )
          )
        )
    );
  }
});

},{"./BaseStateCorner.jsx":10,"./OutgoingCall.jsx":31,"./Window.jsx":48}],33:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div( {className:"Panel " + this.props.extraClass}, 
         this.props.children 
      )
    )
  }
});

},{}],34:[function(require,module,exports){
/** @jsx React.DOM */

_animationDefaults = require('../utils/defaults.js').animation;

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {
      isMoved: false
    }
  },
  slideTo: function(loc) {
    $(this.refs.slider.getDOMNode()).velocity({
      translateX: loc
    }, _animationDefaults);
  },
  toggle: function() {
    if(this.state.isMoved)
    {
      this.slideTo(0);
    }
    else {
      this.slideTo('-48%');
    }
    this.setState({
      isMoved: !this.state.isMoved
    });
  },
  componentDidMount: function() {
    var group = this;
    $(this.getDOMNode()).on('PanelGroup', function(event, data){
      switch(data.type) {
        case "toggle":
          group.toggle();
          break;

        case "back":
          group.slideTo(0);
          group.setState({
            isMoved: false
          });
          break;
      }
    });
  },
  componentWillUnmount: function() {
    $(this.getDOMNode()).off('PanelGroup::toggle');
  },
  render: function(){
    var isMoved = this.state.isMoved ? 'moved' : null;
    var classname = ["PanelGroup", isMoved].join(' ');
    return (
      React.DOM.div( {className:classname}, 
        React.DOM.div( {ref:"slider", className:"PanelGroupInner"}, 
          this.props.children
        )
      )
    )
  }
})
},{"../utils/defaults.js":5}],35:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
PanelGroup = require('./PanelGroup.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
Header = require('./Header.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          PanelGroup(null, 
            Panel( {items: this.props.items }, 
              Header( {username:STRINGS.loggedOutUsername, editText:STRINGS.changeUsername, slideTo:this.props.slideTo}),
              Footer( {linkText:STRINGS.signIn})
            ),
            Panel( {items: this.props.items }, 
               NewCallView(null)
            )
          )
        )
    );
  }
});
},{"./BaseState.jsx":9,"./Footer.jsx":17,"./Header.jsx":18,"./NewCallView.jsx":29,"./Panel.jsx":33,"./PanelGroup.jsx":34,"./TabBar.jsx":45}],36:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
NewCallViewQuick = require('./NewCallViewQuick.jsx');
Footer = require('./Footer.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
            Panel( {extraClass:"LegalPanel", items: this.props.items }, 
              React.DOM.div( {className:"Legal"}, 
                React.DOM.p(null, "By proceeding, you accept the ", React.DOM.a( {href:"https://accounts.firefox.com/en-us/legal/terms"}, "Terms and Services"), " and ", React.DOM.a( {href:"https://accounts.firefox.com/en-us/legal/privacy"}, "Privacy Notice"),"."),
                Button( {text:"OK", style:"default"} )
              ),
              NewCallViewQuick(null),
              Footer( {linkText:STRINGS.signIn, username:STRINGS.loggedOutUsername})
            )
        )
    );
  }
});

},{"./BaseState.jsx":9,"./Footer.jsx":17,"./HeaderQuick.jsx":19,"./NewCallViewQuick.jsx":30,"./Panel.jsx":33,"./TabBar.jsx":45}],37:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
NewCallViewQuick = require('./NewCallViewQuick.jsx');
Footer = require('./Footer.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
            Panel( {items: this.props.items }, 
              NewCallViewQuick(null),
              Footer( {linkText:STRINGS.signIn, username:STRINGS.loggedOutUsername})
            )
        )
    );
  }
});

},{"./BaseState.jsx":9,"./Footer.jsx":17,"./HeaderQuick.jsx":19,"./NewCallViewQuick.jsx":30,"./Panel.jsx":33,"./TabBar.jsx":45}],38:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
PanelGroup = require('./PanelGroup.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
Header = require('./Header.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          PanelGroup(null, 
            Panel( {items: this.props.items }, 
              Header( {username:STRINGS.loggedInUsername, editText:STRINGS.viewAccount}),
              BuddyList( {items:this.props.items} ),
              Footer( {linkText:STRINGS.signOut})
            ),
            Panel( {items: this.props.items }, 
               NewCallView(null)
            )
          )
        )
    );
  }
});
},{"./BaseState.jsx":9,"./Footer.jsx":17,"./Header.jsx":18,"./NewCallView.jsx":29,"./Panel.jsx":33,"./PanelGroup.jsx":34,"./TabBar.jsx":45}],39:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          Panel( {extraClass:"Contacts", items: this.props.items }, 
            NewCallViewQuick(null),
            BuddyList( {items:this.props.items} ),
            Footer( {linkText:STRINGS.signOut, username:STRINGS.loggedInUsername})
          )
        )
    );
  }
});

},{"./BaseState.jsx":9,"./Footer.jsx":17,"./HeaderQuick.jsx":19,"./NewCallView.jsx":29,"./Panel.jsx":33,"./TabBar.jsx":45}],40:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    var callType = Math.random() > 0.5 ? 'Video call' : 'Audio call';
    var callTime = moment().subtract('minutes', Math.random()*6000);
    var callIcon = callType === 'Video call' ? 'fa-video-camera' : 'fa-phone';
    return {
      isDropdownVisible: false,
      callType: callType,
      callIcon: callIcon,
      callTime: callTime
    }
  },
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  hideDropdown: function() {
    $(this.refs.callDropdown.getDOMNode()).hide();
    this.setState({
      isDropdownVisible: false
    });
  },
  toggleDropdown: function(){
    if(this.state.isDropdownVisible) {
      $(this.refs.callDropdown.getDOMNode()).hide();
    } else {
      $(this.refs.callDropdown.getDOMNode()).show();
    }
    this.setState({
      isDropdownVisible: !this.state.isDropdownVisible
    });
  },
  render: function(){
    return (
      React.DOM.div( {onClick:this.onClick, className:["Profile", this.props.selected].join(' ')} , 
        React.DOM.div( {className:"avatar user-" + this.props.user.index}),
        React.DOM.div( {className:"details"}, 
          React.DOM.div( {className:"username"},  this.props.user.name,  " ", React.DOM.i( {className:this.props.user.isGoogle ? 'fa fa-google' : ''})),
          React.DOM.div( {className:"email"}, 
            React.DOM.i( {className:"fa " + this.state.callIcon} ),
             this.state.callTime.calendar()
          )
        ),
        React.DOM.div( {className:"icons", onClick:this.toggleDropdown}, 
          React.DOM.i( {className:"fa fa-video-camera"}),
          React.DOM.i( {className:"fa fa-caret-down"})
        ),
        React.DOM.ul( {ref:"callDropdown", onMouseLeave:this.hideDropdown, className:"Dropdown"}, 
          React.DOM.li(null, React.DOM.i( {className:"fa fa-video-camera"}),"Video Call"),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-phone"}),"Audio Call"),
          React.DOM.li( {onClick:this.props.onClickEdit}, React.DOM.i( {className:"fa fa-user"}),"Edit Contact..."),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-trash-o"}),"Remove Contact")
        )
      )
    )
  }
})

},{}],41:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {
      isDropdownVisible: false,
    }
  },
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  hideDropdown: function() {
    $(this.refs.callDropdown.getDOMNode()).hide();
    this.setState({
      isDropdownVisible: false
    });
  },
  toggleDropdown: function(){
    if(this.state.isDropdownVisible) {
      $(this.refs.callDropdown.getDOMNode()).hide();
    } else {
      $(this.refs.callDropdown.getDOMNode()).show();
    }
    this.setState({
      isDropdownVisible: !this.state.isDropdownVisible
    });
  },
  render: function(){
    return (
      React.DOM.div( {onClick:this.onClick, className:["Profile", this.props.selected].join(' ')} , 
        React.DOM.div( {className:"avatar user-" + this.props.user.index}),
        React.DOM.div( {className:"details"}, 
          React.DOM.div( {className:"username"},  this.props.user.name,  " ", React.DOM.i( {className:this.props.user.isGoogle ? 'fa fa-google' : ''})),
          React.DOM.div( {className:"email"}, 
             this.props.user.email 
          )
        ),
        React.DOM.div( {className:"icons", onClick:this.toggleDropdown}, 
          React.DOM.i( {className:"fa fa-video-camera"}),
          React.DOM.i( {className:"fa fa-caret-down"})
        ),
        React.DOM.ul( {ref:"callDropdown", onMouseLeave:this.hideDropdown, className:"Dropdown"}, 
          React.DOM.li(null, React.DOM.i( {className:"fa fa-video-camera"}),"Video Call"),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-phone"}),"Audio Call"),
          React.DOM.li( {onClick:this.props.onClickEdit}, React.DOM.i( {className:"fa fa-user"}),"Edit Contact..."),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-trash-o"}),"Remove Contact")
        )
      )
    )
  }
})

},{}],42:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"SearchBarWrapper"}, 
        React.DOM.input( {ref:"searchInput", className:"SearchBar", value:this.props.val, onChange:this.props.handleChange, placeholder:STRINGS.searchPlaceholder})
      )
    )
  }
});

},{}],43:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  render: function(){
    return (
      React.DOM.div( {onClick:this.onClick, className:["SmallProfile", "Profile", this.props.selected].join(' ')} , 
        React.DOM.div( {className:"avatar user-" + this.props.user.index}),
        React.DOM.div( {className:"details"}, 
          React.DOM.div( {className:"username"},  this.props.user.name ),
          React.DOM.div( {className:"email"},  this.props.user.email )
        )
      )
    )
  }
})

},{}],44:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  componentDidMount: function(){
    var target = this.getDOMNode();
    var spinner = new Spinner({
      color: '#999',
      width: 4,
      lines: 13,
      corners: 1.0,
      trail: 60
    }).spin(target);
  },
  render: function(){
    return (
      React.DOM.div( {className:"SpinnerView"})
    )
  }
});
},{}],45:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.ul( {className:"TabBar"}, 
        React.DOM.li( {className:(this.props.selected === 0) ? 'active tip' : 'tip', 'data-tip':"Call Tab"}, 
          React.DOM.a( {href:"#precall"}, React.DOM.i( {className:"fa fa-phone"}))
        ),
        React.DOM.li( {className:(this.props.selected === 1) ? 'active tip' : 'tip', 'data-tip':"Call History Tab"}, 
          React.DOM.a( {href:"#callhistory"}, React.DOM.i( {className:"fa fa-clock-o"}))
        ),
        React.DOM.li( {className:(this.props.selected === 2) ? 'active tip' : 'tip', 'data-tip':"Contacts"}, 
          React.DOM.a( {href:"#contacts"}, React.DOM.i( {className:"fa fa-book"}))
        )
      )
    )
  }
});

},{}],46:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    var linkView = function(item, index){
      return (React.DOM.a( {href:"#" + item.slug}, item.name))
    }.bind(this);

    return (
      React.DOM.div( {ref:"container", className:"TableOfContents"}, 
        this.props.items.map(linkView)
      )
    )
  }
});
},{}],47:[function(require,module,exports){
/** @jsx React.DOM */
CallControls = require('./CallControls.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"VideoCall"}, 
        CallControls(null),
        React.DOM.div( {className:"VideoScreen"}, 
          React.DOM.div( {className:"VideoScreenInner"}
          )
        )
      )
    )
  }
});

},{"./CallControls.jsx":13}],48:[function(require,module,exports){
/** @jsx React.DOM */
var WindowTitlebar = React.createClass({displayName: 'WindowTitlebar',
  render: function(){
    return (
      React.DOM.div( {className:"WindowTitlebar " + this.props.type}, 
        React.DOM.h5(null, this.props.title),
        React.DOM.div( {className:"WindowControls"}
        )
      )
    )
  }
});

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div( {className:"Window " + this.props.extraClass}, 
        WindowTitlebar( {title:this.props.title, type:this.props.type}),
        React.DOM.div( {className:"WindowBody"}, 
           this.props.children 
        )
      )
    )
  }
});

},{}]},{},[2])