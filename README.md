HealFolio
=========

<sub> Level Seven Crew </sub>
-----------------------------

Summary
-------

The results of the requirements elicitation and the analysis activities are docu-
mented in the Requirements Analysis Document (RAD). This document com-
pletely describes the system in terms of functional and nonfunctional require-
ments and serves as a contractual basis between the customer and the developer.
The RAD must be written in the language of the customer’s domain of busi-
ness/expertise. Under no circumstances should any "computerese" terminology
creep into this document.

Audience
--------

The audience for the RAD includes the customer, the users, the project man-
agement, the system analysts (i.e., the developers who participate in the re-
quirements), and the system designers (i.e., the developers who participate in
the system design). The first part of the document, including use cases and
nonfunctional requirements, is written during requirements elicitation.  The
formalization of the specification in terms of object models is written during
analysis. We use an example template for a RAD introduced in the book.

# 1 Introduction

The first section of the RAD is an Introduction. Its purpose is to provide a brief
overview of the function of the system and the reasons for its development, its
scope, and references to the development context (e.g., reference to the prob-
lem statement written by the client, references to existing systems, feasibility
studies). The introduction also includes the objectives and success criteria of
the project.

### 1.1 Purpose of the system

### 1.2 Scope of the system

### 1.3 Objectives and success criteria of the project

### 1.4 Definitions, acronyms, and abbreviations

### 1.5 References

### 1.6 Overview

# 2 Current system

The second section, Current system, describes the current state of affairs. If the
new system will replace an existing system, this section describes the function-
ality and the problems of the current system. Otherwise, this section describes
how the tasks supported by the new system are accomplished now.

# 3 Proposed system

The third section documents the requirements elicitation and the analysis model
of the new system.

### 3.1 Overview

The overview presents a functional overview of the system.

### 3.2 Functional requirements ("shall lists")

Functional requirements describes the high-level functionality of the system.

##### 3.2.1 -

##### 3.2.2 -

##### 3.2.3 -

### 3.3 Nonfunctional requirements

Nonfunctional requirements describes user-level requirements that are not di-
rectly related to functionality. This includes usability, reliability, performance,
supportability, implementation, interface, operational, packaging, and legal re-
quirements.

##### 3.3.1 Usability

##### 3.3.2 Reliability

##### 3.3.3 Performance

##### 3.3.4 Supportability

##### 3.3.5 Implementation

##### 3.3.6 Interface

##### 3.3.7 Packaging

##### 3.3.8 Legal

### 3.4 System models

System models describes the scenarios, use cases, object model, and dynamic
models for the system.  This section contains the complete functional spec-
ification, including mock-ups illustrating the user interface of the system and
navigational paths representing the sequence of screens. The subsections Object
model and Dynamic model are written during the Analysis activity.

##### 3.4.1 Scenarios

##### 3.4.2 Use case model

##### 3.4.3 Analysis object model

##### 3.4.4 Dynamic model

##### 3.4.5 User interface—navigational paths and screen mock-ups

# 4 Glossary

A glossary of important terms, to ensure consistency in the specification and to
ensure that we use the client’s terms. A precursor to the Data Dictionary.

Appendix A: Statement of Effort
-------------------------------

|                 | Daniel  | Tumbone | Adam | Jan |
| :-------------: | ------: | ------: | ---: | --: |
| Finishing       |         |         |      |     |
| Introduction    |         |         |      |     |
| Current System  |         |         |      |     |
| Proposed System |         |         |      |     |
| Glossary        |         |         |      |     |

<p align="center"> <sub> <b> Normal Text </b> </sub> </p>

<p align="center"> Normal Text </p>

# Heading #

Normal Text

<p align="center"> <b> Some Links:</b> <br> <a href="#"> Link 1 </a> | <a href="#"> Link 2 </a> | <a href="#"> Link 3 </a> <br> <br> <img src="http://s.4cdn.org/image/title/105.gif"> </p>

Normal text

Central Medical Information

**This is bold text**

*This text is italicized*

~~This was mistaken text~~

**This text is _extremely_ important**

In the words of Abraham Lincoln:
> Pardon my French

Use `git status` to list all new or modified files that haven't yet been committed.

This site was built using [GitHub Pages](https://pages.github.com/).

- George Washington
- John Adams
- Thomas Jefferson

1. James Madison
2. James Monroe
3. John Quincy Adams

1. Make my changes
  1. Fix bug
  2. Improve formatting
    * Make the headings bigger
2. Push my commits to GitHub
3. Open a pull request
  * Describe my changes
  * Mention all the members of my team
    * Ask for feedback

- [x] Finish my changes
- [ ] Push my commits to GitHub
- [ ] Open a pull request

@github/support What do you think about these updates?

@octocat :+1: This PR looks great - it's ready to merge! :shipit:

Let's rename \*our-new-project\* to \*our-old-project\*.

# The largest heading
## The second largest heading
###### The smallest heading

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

| Command | Description |
| --- | --- |
| git status | List all new or modified files |
| git diff | Show file differences that haven't been staged |

| Command | Description |
| --- | --- |
| `git status` | List all *new or modified* files |
| `git diff` | Show file differences that **haven't been** staged |

| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |

| Name     | Character |
| ---      | ---       |
| Backtick | `         |
| Pipe     | \|        |

```
function test() {
  console.log("notice the blank line before this function?");
}
```

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

Visit https://github.com

It's very easy to make some words **bold** and other words *italic* with Markdown. You can even [link to Google!](http://google.com)

# This is an <h1> tag
## This is an <h2> tag
###### This is an <h6> tag

This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_

* Item 1
* Item 2
  * Item 2a
  * Item 2b
  
1. Item 1
2. Item 2
3. Item 3
   * Item 3a
   * Item 3b

http://github.com - automatic!
[GitHub](http://github.com)

As Kanye West said:

> We're living the future so
> the present is our past.

I think you should use an
`<addr>` element here instead.

```javascript
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
```

function fancyAlert(arg) {
      if(arg) {
        $.facebox({div:'#foo'})
      }
    }

ef foo():
    if not bar:
        return True

- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column
