# A table of useful commands

Here are some useful commands - use `man` to get more information:

| Command | What it does |
| --- | --- |
| `hostname` | What computer am I on? |
| `pwd` | What directory am I in? |
| `mkdir` | Create a new directory. |
| `ls` | List files in a directory, or a file or files you specify. |
| `cp` | **Copy** a file in a new location. |
| `mv` | **Move** a file to a new location (removing the original). |
| `rm` | Removes a file **without asking for confirmation**. |
| `rmdir` | Removes an entire directory. (Fails if the directory is not empty.) |
| `touch` | Changes the accessed and modified time on a file, by default to the current time. If the file doesn't exist, create a blank file. |
| `which` | Tells you where a command is on the filesystem. |
| `cat` | Show the contents of a text file. |
| `head` | Shows the first few lines of a file. |
| `tail` | Shows the last few lines of a file. You can combine `head` and `tail` using pipes to pull out a specific block of lines from a file. |
| `less` | Show the contents of a text file, interactively. |
| `man` | Use `less` to show the man page for a command. |
| `wc` | Counts the lines, words and letters in its input. |
| `grep` | **Searches** for a snippet of text in a file, showing matching lines. |
| `cut` | Print certain columns from a text file that's a table of data. |
| `awk` | Can do similar things to `cut`. It has its own language to specify in more detail how to process the file, which can be tough to learn, but it is more versatile than `cut`. |
| `tr` | Short for 'translate'. It lets you replace characters with other characters. This is useful to fix inconsistent data formats or remove characters that another tool can't handle. |
| `sed` | Short for 'stream editor'. Similar to `tr`, but it also supports more than single characters allowing for more complex replacements. |
| `sort` | Sorts the lines of a file. |
| `uniq` | Prints unique lines in a file (i.e. removing duplicates). It does not work exactly as you might expect, only removing duplicates on sequential lines. To get the truly unique output, you need to use `sort` first. |
| `wget` | Short for 'web get', this tool downloads a file from the internet, by default into the current directory. |
| `curl -O` | Downloads a file from the internet, by default into the current directory. |
| `gzip` | Compress a file (adding the `.gz` suffix) |
| `gunzip` | Decompress a gzipped file (removinf the `.gz` suffix) |
| `tar` | Collect up a directory structure into a single file, suitable for transfer |
| `ssh` | Securely log into a remote computer, based on the address you give it. |
| `scp` | Securely copy files from or to a remote computer. |
