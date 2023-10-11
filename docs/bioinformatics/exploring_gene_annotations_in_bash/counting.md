---
sidebar_position: 7
---

# Counting genes

Quit `less` if you are in it (by pressing `q`) and let's generate some basic statistics. 

First, how many genes and other things are in the file? For this, we can use the `cut` command to cut out the
third column (which contains the `type`). Then we'll *pipe the output* into the sort command (which sorts the
rows).  And finally we will ask the `uniq` command to count:
```sh
cut -f3 gencode.v41.annotation.gff3 | sort | uniq -c
```    

This will take a minute or two to run - it's a big file!

Ok - the output is not really useful because of all the metadata.  Let's use `grep -v` to get rid of it:
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | sort | uniq -c
```    

This **finds lines** that don't contain `#`, **extracts the third column** from them, **sorts them**, and **counts
the unique values**.

:::tip Picking apart the pipeline

If this command isn't making sense to you, a good idea is to look at what each step does.
Try running these commands one by one to parse it apart:

View the whole file:
```sh
less -S gencode.v41.annotation.gff3
```

Just the data rows:
```sh
grep -v '#' gencode.v41.annotation.gff3 | less -S
```
Just the third column of the data rows:
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | less -S
```
The third column sorted:
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | sort | less -S
```
The sorted unique values in the third column....
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | sort | uniq | less -S
```
...and the same thing with counts:
```sh
grep -v '#' gencode.v41.annotation.gff3 | cut -f3 | sort | uniq -c | less -S
```

Hopefully by this point it is clear(er) what each step is doing.
:::

It prints:

    872459 CDS
    1625321 exon
    171599 five_prime_UTR
     61852 gene
     97009 start_codon
     90749 stop_codon
       119 stop_codon_redefined_as_selenocysteine
    203260 three_prime_UTR
    251236 transcript

So - there are 1.6 million exons in the file and... *wait a moment*, are there really 60,000 genes in the human genome?

:::tip Question
The number 60,000 is way too big - why?
:::
