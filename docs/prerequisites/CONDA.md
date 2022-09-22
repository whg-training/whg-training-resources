---
sidebar_position: 2
---

# Setting up Conda

One of the easiest ways to set up your environment that works across platforms is to use conda.
Conda creates 'virtual environments' that don't break the rest of your system, and uses a
comprehensive package manager. It has a dedicated [bioconda channel](https://bioconda.github.io)
that makes it easy to install software for biomedical research.

## Installing conda

The recommended way is to install `miniconda` which is a minimal environment that lets you install
the packages you want.  To get it: 

**If you are on Mac OS X or linux**, download the appropriate installer from
[the miniconda download page](https://docs.conda.io/en/latest/miniconda.html).

**If you are on Windows**, **download the linux 64-bit version anyway**. This is because we will
install it into the Linux subsystem for Windows.

**Note.** The installer is a bash (`.sh`) file. On Mac OS X, there are also OS X packages (`.pkg`)
installers available - run this instead if you want to and skip to the next section.

**Note.** Because this is an installer downloaded from the internet, you should check it's
the real thing before installing it. See the
[page on cryptographic hash verification](https://conda.io/projects/conda/en/latest/user-guide/install/download.html#cryptographic-hash-verification)
and compare the output to the SHA256 has in the output table. If it's
different, don't install!

**To install**, start a terminal and change directory to the downloads folder:

* on **Mac OS X**:
```
$ cd Downloads
```
* on **Windows**:
```
$ cd /mnt/c/Users/<username>/Downloads
```
* on **Linux**: probably
```
$ cd Downloads
```

You can check what's there by running `ls`.  Now run the installer:
```
$ ./Miniconda3-latest-<platform>.sh
```

You will be asked to accept the license and choose an install location. If in doubt, the defaults
are fine.  Say 'yes' when asked if you want to initialise the installer.

**Note.** If you read the blurb this command outputs, you'll see it says it is **activating the
conda environment by default on startup**. This means, when you start a new terminal, conda is
managing your environment for you.  You'll see this because in new terminals the command prompt will look like this:
```
(base) <username>@<computer>:~$
```

You can **deactivate the environment** (going back to normal) with the `conda deactivate` command
```
$ conda deactivate
```

And you can reactivate it with - you guessed it!
```
$ conda activate
```

This is a **downside of using conda**: you have to remember what environment you're in at any one
time.

### The upside of conda

The upsides of conda are that it makes installing stuff easy. The first thing we want is a better
(faster) version of `conda` itself, called `mamba`:
```
$ conda install -c conda-forge mamba
```

The `mamba` package lives in the `conda-forge` channel, hence the `-c` above.  Type 'y' and press &lt;enter&gt; to install.

Now let's try installing `samtools`. For most work with
[next-generation sequencing data](Next-generation sequencing/README.md)
you'll want a fairly recent version, so let's get version `1.15`:

```
$ mamba install -c conda-forge -c bioconda samtools=1.15
```

If you look at the output you'll see that this is getting `htslib` and `samtools` from bioconda,
but also `libdeflate` from `conda-forge`.  Go ahead and install.  Running samtools now gives you some output:

```
$ samtools

Program: samtools (Tools for alignments in the SAM format)
Version: 1.15.1

Usage: samtools <command> [options]
...
```

## Extra bit: what even is an 'environment'?

UNIX figures out how to find programs and other things using 'environment variables'. All conda is
really doing is setting these to point to its own copies of files.

For example the `HOME` environment variable points at your home folder:
```
$ echo ${HOME}
/users/<username> (or similar)
```

Let's go back there now and see what's there:
```  
$ cd ${HOME}
$ ls
```

Conda has created a directory called `miniconda3` in there where it puts the things it installs.
For example the executable programs go in `bin`:

```
$ ls miniconda3/bin
```

If you look there you will see (among many other things) the `samtools` executable - because we just installed it.

How does your terminal know how to find this? This works because conda sets relevant environment
variables - in particular it adds this directory to your `PATH` environment variable, which the
terminal uses to know where to look for programs.  Look:
```
$ echo ${PATH}
/users/<username>/miniconda3/bin: (other stuff here...)
```

So if you type `samtools`, the first place the terminal looks is in that folder.  

If you deactivate the conda environment, `PATH` changes to remove that folder and samtools will no longer work:
```
$ conda deactivate
$ samtools

Command 'samtools' not found...
```

However `samtools` is still there on your filesystem and as it happends, you *can* still run it by
specifying its full path:

```
$ ./miniconda3/bin/samtools
```

In other words conda isn't doing anything magical: it's just managing your environment variables
for you.

(**Note.** While this does work for `samtools` which is a self-contained program, in general you may well need the
conda environment to be activated for all conda-installed packages to work.)

