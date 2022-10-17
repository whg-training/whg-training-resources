---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Making a module

If you've got this far, you've written a function `parse_gff3_to_dataframe()` that [passes the test](gff_code.md).
And hopefully you've tried it out on some real data to check it works as well (if not, do that now.)

That's already cool but let's go one step further. It is now incredibly easy to turn this into a reuseable module. Do it like this:

* Open a new file named `gff.py` in a text editor. (If you don't know what editor to use, [install one now](/prerequisites/editor.md)). For now, this file should go in the same directory as
  your data files, e.g. `genes_programming` if you followed the instructions in [the introduction](./Introduction.md).

* Paste your `parse_gff3_to_dataframe()` function below.   (You also need an `import pandas` in there somewhere.)

* **Congratulations!**  You have now written your first python module.

:::note Note

If you followed the [guide](anatomy_of_getting_it_to_work.md) the module will look something like
[this file](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/programming_with_gene_annotations/solutions/part1/gff.py).

:::

Using your python module is easy:

```python
import gff
X = gff.parse_gff3_to_dataframe( 'gencode.v41.annotation.gff3.gz' )
```

or if you don't want to type the "`gff.`" before the function name:
```python
from gff import parse_gff3_to_dataframe
X = parse_gff3_to_dataframe( 'gencode.v41.annotation.head.gff' )
```

Cool!

:::tip Question

Try this on the real annotation files you downloaded. Does it work? How long does it take to load the data?

:::

### Testing again

Are you done? Well, we are being good testers so you really you should keep your tests along with your module. 

To do that make a seperate file for now - call it `test_gff.py` - and put test code in. The best way to do this is use the python [`unittest`
module](https://docs.python.org/3/library/unittest.html).
See [here](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/programming_with_gene_annotations/solutions/part1/test_gff.py)
for what this looks like.

The two tests in that example were taken from the [introduction](gff_code.md) and the [guide](anatomy_of_getting_it_to_work.py). (If you wrote your own code, you might need to adjust the
second test.)

If you save that code in `test_gff.py` and run it you should see something like:

    $ python ./test_gff.py          
    .
    ----------------------------------------------------------------------
    Ran 2 tests in 0.021s
    
    OK

(If the tests fail - you have a problem.  Fix it before moving on!)

### Next steps

Great!  We have a fully functional, fully tested gff-loading module! Let's [give it a test-drive](./exploring_gencode.md).
