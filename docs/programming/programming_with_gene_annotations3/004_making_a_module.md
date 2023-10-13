---
sidebar_position: 3.6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Making a module

If you've got this far, you've written a function `parse_gff3_to_dataframe()` that [passes the
test](./Getting_started_writing_some_code.md#test-driven-development).  And ope

That's already cool but let's go one step further - because it is now incredibly easy to
turn this into a reuseable module. Do it like this:

* Copy your code into a new file, named `gff.py` using a [text editor](/prerequisites/editor.md). (This file
  should go in your current directory i.e. the one you started python / jupyterhub from.)

* Congratulations!  You have now written your first python module.

To use your python module, simply import it and use like this:

```python
import gff
X = gff.parse_gff3_to_dataframe( 'gencode.v38.annotation.head.gff' )
```

or if you don't want to type the "`gff.`" before the function name:
```python
from gff import parse_gff3_to_dataframe
X = parse_gff3_to_dataframe( 'gencode.v38.annotation.head.gff' )
```

Cool!

### Anything else?

Are we done? Well, really you should keep your tests along with your module. That's easy - e.g. [look at my
version here](solutions/part1/test_gff.py). All I have done there is to collect the test code from the previous
page - with a slight update to use the python's [unit testing
framework](https://docs.python.org/3/library/unittest.html). If you save that in a file called `test_gff.py` and
run it you should see something like:

```
    $ python ./test_gff.py          
    .
    ----------------------------------------------------------------------
    Ran 2 tests in 0.021s
    
    OK
```

(If the tests fail - you have a problem. Fix it before moving on!)

## Next steps

Great!  We have a fully functional, fully tested gff-loading module! Now let's use it to
[write a useful command-line program](Converting_gff_to_sqlite.md).
