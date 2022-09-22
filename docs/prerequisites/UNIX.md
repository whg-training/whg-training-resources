---
sidebar_position: 1
---

# Setting up a UNIX terminal

You will be doing a lot of work in the UNIX terminal - this is a command-line interface.
If you're not familiar with this, you will need to get used to using it.

## Installing the terminal

**Linux** computers have the terminal built in - there's nothing to install. (Although you can, if
you want to, install any of several different flavours. The default one might be `Gnome Terminal`.
If you're using Linux you almost certainly know how to find this already so we won't go into more
detail here.

**Mac OS X** computers also already have a terminal built-in. You can find it in
`Applications/Utilities/Terminal`. Drag into your dock to make it easily available.

**Windows computers** don't natively have a UNIX environment, but luckily you can install one
without difficulty. This is called the 'Windows Subsystem for Linux' and I've given instructions on
this at the bottom of this page. Once you have this installed, come back and test out your terminal.

## Testing the terminal

Whichever method you use, you should now be able to start your terminal and check it is working.
Here are a few practice commands to try.

1. **To find out where we are in the filesystem** use the `pwd` ('present working
directory') command:

```
$ pwd
```

**Note.** Don't type the dollar sign - that's there to indicate the command prompt. Type
`pwd` command and press &lt;enter&gt; to run it.

You should see something like `/home/geoff` (if `geoff` is your username.)

2. **Printing some output**.  A simple way to print stuff is the 'echo' command (which echoes what you've just written):
```
$ echo "Hello, this is a message"
```

3. **Creating a file**.  One way is to 'echo' some text and redirect the output to a file.  LIke this:
```
$ echo "Hello, this is just a test file" > test.txt
```

4. **Listing files**.  To see what's in your current directory, try the `ls` command:
```
$ ls
```

(You should see `test.txt` among any other files that are in there.) Or to see the same thing but
with lots of detail about when the files were created / accessed / modified and so on, try `ls -l`:
```
$ ls -l
```

4. **Seeing file contents**.  A simple way is to use `cat` ('concatenate') which just prints out the contents:
```
$ cat test.txt
```

A more interactive way is to use `less` - first let's put some more lines in:
```
echo "This is a second line" >> test.txt
echo "And this is a third line" >> test.txt
```

**Note.**  The `>>` above says 'add this stuff to the end'.

Now use less to view it:
```
$ less test.txt
```

(Press `q` to quit `less`). `less` is very useful when the file gets larger than the size of your
window, as it lets you scroll around.

5. **Moving around**.  Of course you don't have to stay in this directory - use `cd` (change directory) to move around.
Since you are in `/home/users/`, go up one level to find out what other users are on your system:
```
$ cd ..
$ ls
```

**Note.** `..` means "up one level to the parent directory".

Or up another level to see what's in the filesystem root:
```
$ cd ..
$ ls
```

At this point you should see a bunch of stuff - including `home`, `usr`, `etc` and other folders of
that sort. These are all part of the standard UNIX filesystem.

## Installing  the Windows Subsystem for Linux

To install the UNIX terminal on Windows 10 or above, the best bet is the Windows Subsystem for
Linux. It comes with Windows 10 and effectively installs a copy of Ubuntu linux that interoperates
well with your Windows computer. You can see [full installation
instructionshere](https://learn.microsoft.com/en-us/windows/wsl/install), but here's a brief guide:

* Start a Windows command prompt in "run as administrator" mode. To do this, type 'command' into
  the search box next to the Start menu. Find the 'Command Prompt' app in the results. **Don't
  click it** - instead, right-click on it and select 'run as administrator'. You will be asked to
  allow the app to make changes to your device - click yes. (If you don't have administrator
  priviledges, you'll have to ask your administrator to follow these instructions for you.

* Now in the command prompt, type `wsl --install` and press &lt;enter&gt;.

This will take a minute or two - during this time you'll see various messages about Windows
downloading and installing various components.

* Reboot your computer.

Once you log back in, the installationg will continue - a window will open saying 'Installing:
Ubuntu' (i.e. it is installing a recent version of [Ubuntu Linux](https://ubuntu.com).) 

**Note.** When I tested this, this window never disappeared, but the 'Ubuntu' app was nevertheless
installed. So give this a few minutes and then carry on.

* Once installation is complete, you should have a new `Ubuntu` app in your start menu. The first
  time you click it, it will ask you to choose a new username and password. I suggest to use the
  same username as you have on your computer, but in any case **don't forget these!**
  

### Interacting with the filesystem.

On Mac OS and on Linux, the filesystem in the terminal is the same one the computer uses - you can
see the same files in the Finder / file explorer. For example your home directory (where you start)
is the same place as the main one on your system.

If you are Windows it's slightly different however:

* The UNIX shell home directory is a new one - not the same as `C:/Users/&gt;username&lt;`.
* Instead the `C:` drive appears in the UNIX shell as `/mnt/c` and similarly for other drives.
* The UNIX filesystem is in fact still accessible through Windows Explorer, but at a slightly odd path (see below).

**For Windows users only**: to explore this let's `cd` (change directory) to the C drive and see what's in
there:

```
$ cd /mnt/c
$ ls
```

You should see a bunch of files and folders - including `Users`, `Program Files`, and so on. 

You probably can't create files in this folder due to permissions - so let's go to your Desktop instead.  Try that now:
```
$ cd Users/&gt;my user name&lt;/Desktop
```

**Note.** This is your Windows username - hopefully the same as the username you chose above.

Now you can create a file:
```
echo "Hello, this is a UNIX text file" > test.txt
```

If you look on your Desktop you will now have a new file called `test.txt` with this fascinating message in it!

(Going the other way - seeing the UNIX filesystem from Windows - seems more difficult.)


### Next steps

Congratulations! You are now set up with a UNIX terminal.

