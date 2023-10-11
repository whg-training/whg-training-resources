---
sidebar_position: 3
---

# Decompressing the file

Does your file have `.gz` on the end of its filename?  And how big is it?  You can `ls -lh` to find out:
```
ls -lh ./
```

You'll see something like:

    -rw-r--r--  1 user  group    57M 11 Oct 14:09 gencode.v41.annotation.gff3.gz

This file is 57 megabytes big and ends with `.gz`. (If you're doesn't have `.gz` on the end and looks bigger -
don't worry. It's likely your operating system has decompressed it for you.)

If you have that `.gz` ending the file has been compressed with `gzip`. We could work directly with it, but to
make life simple let's decompress it now:
```
gunzip gencode.v41.annotation.gff3.gz
```

:::tip Note
If you're bored typing the filename - just type the first few letter and press `tab` to auto-complete it.
:::

Use `ls -lh` to see how big it is now. You should see that it's lost the `.gz` ending and now is about 1.4
gigabytes (i.e. $1.4 \times 10^9$ bytes) big.  So `gzip` compressed it by about 24 times!

## Aside on using the compressed file

As it happens, much of this tutorial could be carried out directly using the gzipped version of the
file as well. Instead of using `cat`, `less`, and `grep` in the next few pages, for example, we
could use `zcat` (or `gunzip -c`), `zless`, and `zgrep`.  For other commands like `awk` we would
need to build pipelines that decompress the file first.  This all works fine and helps save disk
space.  

But for the purposes of this tutorial we'll work with the decompressed file for simplicity.

