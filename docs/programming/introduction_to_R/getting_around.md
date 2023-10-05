---
sidebar_position: 6
---

# Getting around

Before going further it's worth pointing out a few convenient features that R has to make your life easier.

## Your history

Like the command-line, R has a command 'history', which you can move around in.  It works like this:

* you can press the up arrow to move back through the recent commands you ran, until you find the one you want.
* press the down arrow to move forwards again.
* you can see the command history by running the `history()` command.  In RStudio, this appears in
  the 'History' tab in  the top-right panel; double-clicking on an entry will paste it back into the
  R sessions.

R also saves your history in a file in your home directory (called `~/.Rhistory`) so that  remains
available next time you start R.

Apart from history, you can also use `<tab>` to auto-complete commands.

## Working directory

R also has a concept of the *current* or *working directory*.  You can see what it is by typing
`getwd`:

```
> getwd()
```

If you start R from the command-line, the working directory will be the directory you started it
from.  If you start it from the operating system, it's likely to be your home directory.

Just like in the command-line, you can create and move around directories - R this uses the `dir.create()` function.
For example:
```
> dir.create( "te_directory" )
> setwd( "my_directory" )
```

(You can try `getwd()` again to check you have really changed.)

:::tip Note

Just as with the command-line, it's important to know 'where' you are in the filesystem when you work with R.

This can become particularly important when you want to work with files, since you'll either need to be in the same directory or specify the path to them - which depends on your current directory.

:::