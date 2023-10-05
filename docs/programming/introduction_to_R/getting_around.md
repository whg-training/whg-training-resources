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

You can also change working directory using `setwd()`:
```
> setwd( "/tmp" )
```

:::tip Note
The working directory becomes important when you want to load or save data from files.
The filenames are written relative to the current working directory.
:::