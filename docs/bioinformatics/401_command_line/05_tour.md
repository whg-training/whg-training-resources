---
sidebar_position: 6
---

# Making directories and moving about

Ok, so you have a terminal and you can run some commands... what now?

The next few pages show a quick demo of some of the kinds of things you can do.  We'll start by learning to move around
through the directory structure, and create simple directories and files.

## Directories (also known as folders)

If you typed `pwd` in the [earlier examples](basics.md) you'll have seen something like this:
```
% pwd
/home/duncan
```
The directory output by `pwd` is your **current working directory** - it tells you where you are in the filesystem. Your
terminal is always 'in' some directory on your filesystem, and right now it is in this one.

:::tip Note

A 'directory' is just a folder that contains files - just as you would see in Explorer on Windows or Finder on a Mac.
We will generally use the words 'folder' and 'directory' interchangeably.

:::

Unless you have done something to change it, the current directory will be your **home directory**. It will look like
`/home/<your username>` or maybe `/Users/<your username>`.  This directory is so useful it also has a special name: "`~`".
So you can always get back there by typing
```
% cd ~
```

(cd stands for 'change directory'.)

Happily, everything in your home directory belongs to you, so you can safely change things without worrying that you
might affect something important that other people are using.

(Depending on your system, the current working directory is probably also displayed in your prompt.)

## Making and moving between directories

Let's make a directory to do some work in - using the `mkdir`  command:

```
% mkdir bash_tutorial
```

(`mkdir` stands for "make directory") and then let's change directory into it:
```
% cd bash_tutorial
```

Run `pwd` again; you should now see something like `/home/duncan/bash_tutorial` - you are now 'in' the new subfolder you created.

To get back to your home folder again, you can type one of these commands:
```
% cd ..
```

OR
```
% cd ~
```

The first of these (`cd ..`) always moves **up one level to the parent directory** of where you are currently.
While, as described above, the second command always changes **back to your home folder** from wherever you are.

:::tip Note
There's one other place you might like to go - the root of the whole filesystem hierarchy.  It is called `/`.
```
% cd /
```
If you type `ls` now you'll see all the top-level directories in the whole filesystem.

:::

To go further though, let's get back to our `bash_tutorial` directory inside our home directory:

`% cd ~/bash_tutorial`

This command uses a whole directory *path* - `~/bash_tutorial`.  The first part (`~`) is your home directory, and the
second part (`bash_tutorial`) is the subdirectory of your home directory we just created.  The are separated in the path
by the directory separator `/`.

## Moving faster

You may already be getting tired of typing these long directory names. Luckily BASH has a very important feature known
as 'tab completion' that does it for us.  This is best learnt by trying it - let's try that last one again.
First let's cd to your home directory:

```
% cd ~
```

To change back into our bash tutorial this time, try typing just `cd ba` **and then press `<tab>`**.

What you should see is that BASH has figured out that you must have meant `bash_tutorial` (because there aren't any
other files or folders starting with 'ba' in there) so it has auto-completed it for you.

This makes finding your way through folders much quicker.  Try it on some other folders, like `~/bash_tutorial/archive`
for example. 

:::tip Question
What happens if there are two files starting 'ba' in the folder?  (Try it by making another one.)
**Hint.** Try pressing `<tab>` a few times.
:::

## Making some files

Right now there's nothing in this directory (since we just created it).  Let's create some files so we have a more
realistic-looking directory:

```
% touch bash_intro1.md  bash_intro_2012.md  bash_intro2.md
% touch bash_introduction.doc  bash_intro.md  bash_intro.md.old
% touch .very_secret
```

The `touch` command just creates new, empty files (if they don't exist already) - check using `ls`:

~~~~
ls
~~~~

You should see something like:

    bash_intro1.md      bash_intro2.md         bash_intro.md
    bash_intro_2012.md  bash_introduction.doc  bash_intro.md.old

:::tip Note
What happened to `.very_secret`?  Because it starts with a `.`, it is a **hidden** by default.
To see it you have to use `ls -a`:
```
% ls -a
.             bash_intro.md      bash_intro2.md
..            bash_intro.md.old  bash_intro_2012.md
.very_secret  bash_intro1.md     bash_introduction.doc
```

Now we can see `.very_secret`, along with the dummy entries `.` (which means "this directory") and `..` (which means "the parent directory").
:::

Hmm, these files are a bit messy!  Let's make another new folder and tidy away some of those files.

`% mkdir archive`

Type `ls` to list the directory again and check that `archive` has been created:

    archive         bash_intro_2012.md  bash_introduction.doc  bash_intro.md.old
    bash_intro1.md  bash_intro2.md      bash_intro.md

We'll use the `mv` command to move some of those files into the `archive` folder:

~~~~
mv bash_intro.md.old bash_introduction.doc archive/
~~~~

`mv` stands for "move", and allows you to move files from one place to another. In the form above it takes the files
represented by all positional arguments except the last one and puts them in the directory which is its final argument.

`mv` can also be used to rename files:

`% mv bash_intro_2012.md bash_intro_oldest.md`

It even works on directories

`% mv archive old`

Another thing you could do is copy files instead of moving them - this uses the command `cp` instead:

`% cp bash_intro.md bash_intro_final.md`

:::tip Question

Check what's in the folder now with `ls`.  Does it match what you expect?

:::

## Removing files and folders

Our 'bash_tutorial` folder is still a bit messy:

```
% ls
bash_intro.md   bash_intro2.md       bash_intro_oldest.md
bash_intro1.md  bash_intro_final.md  old
```

Let's clean it up a bit more by deleting some files.  To remove files you can use the `rm` command:

```
% rm bash_intro2.md
```

If you want to remove a directory, you can use `rmdir`, however there's a caveat:

~~~~
rmdir old
~~~~

This will probably say:

    rmdir: failed to remove 'old': Directory not empty

This is because `rmdir` only works **if the directory is empty**.  (This is a **good thing** as it can stop you accidentally deleting lots of files.)

If you really want to remove a whole folder and all its contents, you can pass the `-r` argument to `rm`,
which tells it to remove the directory "recursively":

`rm -r old`

Type `ls` to check the directory has been removed.

Finally, if you want to operate on multiple files at the same time - for example to delete all files those starting with
a particular name - you can use the wildcard character `*`. To demonstrate, let's create some files now:
```
touch for_deletion_1.txt for_deletion_2.txt for_deletion_3.txt
```

...and remove them again:

```
rm for_deletion*.txt
```

:::caution Caution 

These commands **delete files permanently** - you can't get them back.  And they don't ask for confirmation!

You shouldn't run them until you are 100% certain what files they will affect.

Especially when using wildcards, you should always try to use `ls` first to verify what will be deleted, e.g.:

```
ls for_deletion*.txt
```

:::

## Next steps

Go and read some [important facts about filenames](06_important_facts_about_filenames.md).

