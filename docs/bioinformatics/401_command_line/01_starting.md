---
sidebar_position: 3
---

# Starting a terminal

A **terminal** window is how you can access the command line.  To get started you need to open one!
Depending on how you are running this tutorial, there are a few different ways to do this.  In short you can

- use a JupyterHub instance - see [this section](#using-the-jupyterhub-site).
- or use a terminal on your own laptop or PC - see [this section](#using-your-computer-instead).

Please go and read the appropriate section of this page - then when you've opened a terminal window, move on to the
[command-line basics](02_basics.md).

## Opening a terminal on JupyterHub

If you have set up a JupyterLab site (for example by [following these instructions](/prerequisites/Jupyterlab.md)) or
have access to a JupyterHub cloud instance, you can use it to start a terminal.  Logging into the site you should see a
page that looks something like this:

![img](images/JupyterLab.png)

To start a terminal, click the 'Terminal' button which should give you something like this:

![img](images/JupyterLab_terminal.png)

What you see there is the **command prompt**.  It will probably look a bit like this:

```
<username>@<computer name> ~ % ▮
```

...that is, it shows your username, the name of the computer you're using, and also the path to the directory you are
currently in (which will start of as `~`, meaning your're in your home directory.) The prompt will end with a `%` (or
sometimes `$`) character,  indicate the prompt itself.

:::tip Note

This command-line prompt can in fact look a bit different depending on where you are running from.  In this tutorial we
will generally just write a percent sign
```
%
```
to indicate the prompt.

:::

To check things are working, let's try out a simple command - type `echo "Hello, $USER!"`into the terminal and press `Enter`.  You should see something like:

```
% echo "Hello, $USER!"
Hello, gav!
```

If this is your first UNIX command - congratulations!

:::caution Note

Remember that in the above - the `%` indicates the command prompt.  You shouldn't type the `%` but just type the command and then press `<Enter>` to make it run.
:::

One thing to remember about JupyterHub is that it is running in the 'cloud' - the files are not stored on your local
computer but on a remote virtual machine.  To get any files you create back to your computer, you can download them -
you can do this by right-clicking in the file list and choosing `Download`.

Once you have this working, move on to the [command-line basics](02_basics.md).

## Opening a terminal on your computer

Alternatively you can use the terminal built-in to your computer - here are some instructions.  Doing this depends a bit
on which platform you are using:

**Linux computers** (such as the BMRC Research compute cluster) have the terminal built in. If you're using Linux you
almost certainly know how to find this already.

**Mac OS X** computers also already have a terminal built-in (the operating system is a UNIX-like one behind the
scenes). You can find it in `Applications/Utilities/Terminal`. Drag into your dock to make it easily available, then
click to start it.

For **Windows** computers, things are a bit more complex - you'll need to install something called the **Windows Subsystem for Linux** (WSL). See [here](appendices/installing_wsl.md) for instructions on getting this installed.  The terminal will then appear in your 'Start' menu as an item called 'Ubuntu for Linux'.  Click to start it.

:::warning Warning

Windows also has its own command line tools, called 'Command Prompt' (or 'cmd.exe') and 'powershell.exe'. These aren't
UNIX-style terminals, and work differently to the examples here.  For this tutorial, make sure you are using the 'Ubuntu
for Windows' terminal.

:::

In all cases you should see a command prompt, similar to the one on the JupyterHub site, something like this:

```
<username>@<computer name> % ▮
```

and you should be able to run a basic command:

```
% echo "Hello, $USER!"
Hello, gav!
```

Once you have this working, move on to the [command-line basics](02_basics.md).

