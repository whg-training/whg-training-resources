# Guidelines for contributors

Contributions to `whg-training-resources` are by invitation - you will need to be part of the `whg-training` github organisation or otherwise be given access.

If you have access, there are two ways to make changes to the repository:

1. you can edit the repository directly through the github interface.  This is the simple and easy, but you won't be able to immediately see the published form of your changes.
2. you can clone the repository onto your local computer, make changes there and push them back to the main repository.  This involves a working knowledge of `git`.

With option 2 you can also set up a local docusaurus installation, which lets you view your changes on the fly just as they will appear online.

## Using a local docusaurus install.

### Getting set up

The rest of this page contains instructions for getting a local insallation of docusaurus such that you can edit and view changes on your local machine before sending them back to the main repository.
This will be most useful if you are making large changes e.g. developing a new training module.

1. You first need a working version of [node.js](https://nodejs.org/en/download/) installed.  When this is working, the commands `node -v` and `npm -v` should tell you the installed versions of node and its package manager respectively.
2. On github interface, fork the `whg-training-resources` repository into your own workspace.
3. In the terminal, clone your fork onto your local machine.  (You can get the link by clicking the 'Code' icon near the top of the `github` page, and then type `git clone [github url]`)
4. Change directory into the cloned `whg-training-resources` folder and install the `docusaurus` modules by running `npm install`.

You should now be set up to make local edits.  To get started, run:

```
npm run start
```

This launches a webserver serving the site in your terminal.  After a short pause it will open a web browser pointed at this local webserver.
(The URL will be `http://localhost:3000/whg-training-resources/`).  Feel free to explore the site (it can take a minute or two to become fully responsive.)

### Making edits

All content is contained in markdown files in the `docs/` folder.  Weare keeping these in hierarchical folders.  Some notes that will help with this:

* Folder and file names should be lower case and no spaces (use underscores instead).
* Use a level 1 heading (a single `#`) at the top of each markdown doc to name it - this will be the name that appears in the sidebar.
* The order of pages in the sidebar (and the title, if you want it different from the top-level heading) can be specified by putting this metadata at the top of the document:
```
---
title: My new document
sidebar_position: 2
---
```

* Other pages on this site can be linked to via relative links, such as:

```
See the [setup instructions](./prerequisites/README.md).
```
Docusaurus will automatically fix the links on the built page.  Links to external pages can be included in a similar way:

```
See the [Wikipedia page DNA sequencing](https://en.wikipedia.org/wiki/DNA_sequencing).
```

* Images or other files can be included in the same directory structure and linked to, e.g.:
```
![img](images/my_nice_illustration.png)
![file](resources/an_example_file.txt)
```
Docusaurus should know what to do with these.  You can check these files into the github repo like other files.

**Note.** Please do not include large files in this way - up to a maximum of a few tens of Kb is a good guide.
These files will take space in the github repo which will not handle large files well. For larger data, files
should currently be stored externally (e.g. on personal web space) and linked to.

