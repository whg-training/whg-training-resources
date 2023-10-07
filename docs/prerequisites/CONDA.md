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

**If you are on Mac OS X or linux**, download the appropriate installer from [the miniconda download
page](https://docs.conda.io/en/latest/miniconda.html).  (For Mac OS X, we recommend using the 'bash' rather than
'pkg' installer, and make sure to choose the intel or Apple silicon version depending on your machine.)

**If you are on Windows**, you want to **download the linux 64-bit version** from within your Ubuntu terminal.  (This is
because we will install it into the Linux subsystem for Windows, rather onto Windows directly.) To do this, copy the
link to the installer, and use `wget` to download it e.g.

 ```
 % wget <paste your link here>
 ```
from the Ubuntu for Windows terminal. 

**Note.** The installer is a bash (`.sh`) file. On Mac OS X, there are also OS X package (`.pkg`)
installers available - run this instead if you want to and skip to the next section.

:::tip Note

Because this is an installer downloaded from the internet, you should check it's the
real thing before installing it.  Run `sha256sum <miniconda filename>` (linux or Ubuntu for Windows) or `shasum -a 256 <miniconda filename>` (Mac OS X) as described  and compare the output to the SHA256 has in the output table. If it's different, don't install!

See [this
page](https://conda.io/projects/conda/en/latest/user-guide/install/download.html#cryptographic-hash-verification)
for more information.

:::

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

:::tip Note
You may need to make the file 'executable' first.  Run
```
$ chmod u+x ./Miniconda3-latest-<platform>.sh
```
to do this.
:::

You will be asked to accept the license and choose an install location. If in doubt, the defaults
install to a folder called `miniconda3` in your home directory, which is fine.  Say 'yes' when asked
if you want to initialise the installer.

## Activating and deactivating conda

If you read the blurb this command outputs, you'll see it says it is **activating the conda
environment by default on startup**. This means, when you start a new terminal, conda is managing
your environment for you.  You'll see this because in new terminals the command prompt will look
something like this:
```
(base) <username>@<computer>:~$
```

Here 'base' is the name of your conda environment.

You can **deactivate the environment** (going back to normal) with the `conda deactivate` command
```
$ conda deactivate
```

And you can reactivate it with - you guessed it!
```
$ conda activate
```

:::tip Note

This is a **downside of using conda**: you have to remember what environment you're in at
any one time.

:::

## Using conda to install software

Conda makes installing stuff easy.   But before getting started let's add two 'channels' that will
be really useful for bioinformatics work.  These are ['conda-forge'](https://conda-forge.org) which
is a 'community-led collection of recipes [...] for the conda package manager', and 'bioconda' which
'lets you install thousands of software packages related to biomedical research'.   The [bioconda
page](https://bioconda.github.io) explains how to do this, namely, using these commands:
```
conda config --add channels defaults
conda config --add channels bioconda
conda config --add channels conda-forge
conda config --set channel_priority strict
```
These commands set up a set of channels with priority going from the bottom to the top. So from now
on conda will look in `conda-forge` first, then `bioconda`, and finally the base `defaults` channel
to find software.

### Getting mamba

The first thing we'll want to get is a better (faster) version of `conda` itself, called `mamba`:

```
$ conda install mamba
```

The `mamba` package lives in the `conda-forge` channel.  Type 'y' and press &lt;enter&gt; to install.

### Installing samtools

Now let's try installing [`samtools`](samtools.github.io), which is a workhorse tool for handling
next-generation sequencing data. While you *can* download the source code and compile it yourself,
conda makes this easy. You'll want a fairly recent version, so let's get version at least `1.15`
which is available from the [bioconda](https://bioconda.github.io) channel:

```
$ mamba install 'samtools>=1.15'
```

:::tip Note

This may not work if you are on a Mac with Apple silicon.  If so don't worry, we'll find a
workaround later. For now, you can 

:::

If you look at the output you'll see that this is getting `htslib` and `samtools` from bioconda, but
also `libdeflate` from `conda-forge`. Go ahead and install. Running samtools now gives you some
output:

```
$ samtools

Program: samtools (Tools for alignments in the SAM format)
Version: 1.15.1

Usage: samtools <command> [options]
...
```

## Aside: what even is an 'environment'?

UNIX figures out how to find programs and other things using so-called 'environment variables'. You
can see them all using the `env` command:
```
$ env
```

All conda is really doing is changing environment variables to point to its own copies of files.

For example the `HOME` environment variable points at your home folder:
```
$ echo ${HOME}
/users/<username> (or similar)
```

Let's go there now and see what's there:
```  
$ cd ${HOME}
$ ls
```

If you've followed the above, you should see that `conda` has created a directory called `miniconda3`
in there where it puts the things it installs. For example the executable programs go in `miniconda3/bin`:

```
$ ls miniconda3/bin
```

If you look there you will see (among many other things) the `samtools` executable - because we just installed it.

To make this work, when you activate conda it sets relevant environment variables to point into
this folder. In particular it adds this `bin` directory to your `PATH` environment variable, which the
terminal uses to know where to look for programs. Look:

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

However `samtools` is still there on your filesystem - as it happens, you *can* still run it by
specifying its full path:

```
$ ./miniconda3/bin/samtools
```

In other words conda isn't doing anything magical here: it's just managing your environment
variables for you. This is basically how 'environments' work: they are systems of environment
variables including `PATH` that tell the UNIX shell where to look for things.

