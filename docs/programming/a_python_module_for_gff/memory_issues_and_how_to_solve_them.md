---
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Memory issues - and how to solve them

A remaining problem with our code is that we've left the extracted attributes in the `attributes` column as well. One one hand
this feels a bit ugly - more importantly it is wasting memory.

To get a sense of this, note that the gene annotation files are pretty large - e.g. around 1.4Gb uncompressed for the GENCODE
human annotations.  How much RAM does it take up, though when we load it?

### Using `top` to figure out usage
One way to figure this out is to use `top`. In your command-line run top like this:

:::note Running top
<Tabs>
  <TabItem value="linux" label="On linux"> 

      On linux:
```
top -u (your username) -o +%MEM
```

And look at the `RES` column for 'resident memory size'

  </TabItem>
<TabItem value="macos" label="On Mac OSX X">
    On Mac OS X:
```
top -U (your username) -omem
```

And look at the `MEM` column.

</TabItem>
</Tabs>
:::

You should see a list of your processes ordered by memory usage - something like this:

    Processes: 813 total, 8 running, 805 sleeping, 3514 threads                                                                                                                                                                        09:06:17
    Load Avg: 8.92, 5.66, 4.30  CPU usage: 12.63% user, 9.47% sys, 77.88% idle   SharedLibs: 797M resident, 139M data, 347M linkedit. MemRegions: 247733 total, 18G resident, 1096M private, 10G shared.
    PhysMem: 59G used (2542M wired), 4550M unused. VM: 311T vsize, 3831M framework vsize, 0(0) swapins, 0(0) swapouts. Networks: packets: 77199079/73G in, 52612004/39G out. Disks: 6973960/141G read, 12283519/309G written.
    
    PID    COMMAND      %CPU TIME     #TH  #WQ  #PORTS  MEM    PURG   CMPRS PGRP  PPID  STATE    BOOSTS             %CPU_ME %CPU_OTHRS UID  FAULTS    COW      MSGSENT   MSGRECV    SYSBSD     SYSMACH    CSW        PAGEI IDLEW     POWE
    52603  Microsoft Ex 0.9  47:21.54 65   16   111152  1238M  17M    0B    52603 1     sleeping *0[100926+]        0.14637 0.12571    501  4979540+  3753     19607098+ 7467399+   44501398+  34590327+  23446004+  713   376609    0.9
    36588  Microsoft Po 0.0  81:55.28 55   18   222674  1010M  9552K  0B    36588 1     sleeping *0[157921]         0.00000 0.00000    501  1271022   5100     28611458  13761037   65118908+  38812521+  32711521+  5196  520523    0.0
    45195  RStudio      1.2  02:09:35 26   5    419     793M   320K   0B    45195 1     sleeping  0[6217]           0.00000 0.00000    501  1216816   1548     4594865   147509129+ 344977910+ 2147483647 306591309+ 3039  1901044   1.2
    45237  QtWebEngineP 0.0  14:40.66 17   1    148     699M+  0B     0B    45195 45195 sleeping *0[8]              0.00000 0.00000    501  749434+   436      1871137+  876469+    3700647+   9228669+   3720845+   3158  137035    0.0
    (etc)
    
(On Mac OS X, you can also use "Activity Monitor" which gives the same result.)

To see how our code uses memory, run `top` in one terminal and then start a new python (or ipython) session in a second terminal.
Import the refactored `gff` library and then load the GENCODE data. You should see a new process called something like `python`
appear in the list. After a few moments it will start to climb up the rankings until it hits (probably) the top of the table. On
my machine, once the GENCODE annotations are loaded, the process is using about 2.4Gb of RAM - that is, about 1Gb more than the
actual size of the data file.

### Diagnosing the problem

Well, how much space does each column actually use up?  Let's start with the `attributes` column, which is pretty big.
We can figure out the total number of bytes represented by adding up their lengths;
```
X.attributes.apply( len ).sum()
```

On my machine this says the actual text in the column takes up 1,404,278,078 bytes. The full uncompressed file size is
1,554,874,927 bytes, so this column alone is 90% of the file!

However it turns out the column actually takes up more than this in memory. To see this, let's use the [sys
module](https://docs.python.org/3/library/sys.html) to capture actual memory usage:
```
import sys
X.attributes.apply( lambda a: sys.getsizeof(a) ).sum()
```

This says 1,569,584,674 i.e. we have paid about 10% extra for the priveledge of storing this in python. 

:::tip Note

This overhead gets worse for smaller strings. How much space is wasted in the `type` column? How much extra space is that per row
of `X`?

:::

In short - most of the space is in the `attributes` column, and about 10% of that is overhead that we probably can't easily get
rid of.

### How to deal with it?

In general there are three strategies to deal with excessive memory use:

1. write code carefully to control memory usage.
2. use more memory-efficient data structures.
3. work with data subsets (specific genome regions, specific record types, smaller organisms, or work in chunks).
4. work with formats that keep data on-disk instead

Here to illustrate I'll take option 1: make a change to remove the extracted attributes from the `attributes` column.
Because of the overhead, this can only be expected to save us a small amount of memory, but let's try anyway.
On the [next page](converting_gff_to_sqlite.py) we'll implement a program that implements options as well.

## Removing attributes

Let's adjust our function to remove the attributes that have been moved to their own columns from the `attributes` column.

In principle this is easy but in practice requires some care if we want to keep memory usage low. This is because it's easy to
inadvertantly copy or otherwise make new versions of the `attributes` column, at which point the memory usage would effectively
double.

To deal with this I have written a third refactoring that:

* has a new function `remove_value_from_attributes()` - very similar to
`extract_value_from_attributes()` - that removes the attribute from the string. 

* and a new function `remove_attributes()` that calls it to remove the attributes.

The simplest approach in `remove_attributes()` was just to use the `apply()` function to apply
`remove_value_from_attributes()` for each attribute (simliar to the `extract_value_from_attributes()` function.)
Unfortunately, that has the effect of *copying the `attributes` column, meaning that the memory

 This is because in manipulating the `attributes` column, it's easy to make a copy that in effect
*increases* rather than decreases the amount of memory used (at least while the data is loading.)
This `remove_attributes()` function was hard to write: simply using `apply()` to the


The top-level function is then:

```
def parse_gff3_to_dataframe(
    file,
    attributes_to_extract = [ 'ID', 'Parent' ]
):
    result = read_gff3_using_pandas( file )
    extract_attributes_as_columns( result, attributes_to_extract )
    remove_attributes( result, attributes_to_extract )
    return result

```



Getting this right is a bit
fiddly as you have to deal with the semicolons properly.  [Here] is a version that implements this.

:::tip Note
If you run the tests again - uh-oh, there's an issue!  You will probably see something like:

    $ python ./test_gff.py 
    .F
    ======================================================================
    FAIL: test_parse_gff3_to_dataframe (__main__.TestGff)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
      File "/Users/gav/Projects/teaching/gms/training-run/genes_programming/./test_gff_version1.py", line 19, in test_parse_gff3_to_dataframe
        assert data['attributes'][0] == 'ID=gene1;other_data=stuff'
    AssertionError
    
    ----------------------------------------------------------------------
    Ran 2 tests in 0.003s
    
    FAILED (failures=1)
    

What's going on? 

**Hint.** this time you should fix the test - the behaviour has indeed changed, but that's what we wanted here.
:::

