---
sidebar_position: 3.6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Making a module

If you've got this far, you've
[written a function `parse_gff3_to_dataframe()`](Getting_started_writing_some_code.md)
and you've
[tested to see it works](testing_it_out.md).

We could stop there but let's not - because it is now incredibly easy to turn this into a reuseable
module.  Do it like this:

* Copy your code into a new file, named `gff.py`. (This should go in your current directory i.e.
  the one you started python / jupyterhub from.)

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

### Next steps

Now let's use this module to [write a useful program](Converting_gff_to_sqlite.md).



## Optional section: unit testing

This section contains a quick overview of unit testing.

Let's finish off what we did by collecting our tests too. In this single-file-as-module `gff.py`
there's no very good place to put our tests, so let's put them in a seperate `test_gff.py` file
for now.

To make the tests easy to use it pays to use a full **unit testing** framework. Luckily python
provides one - the `unittest` module. Using requires just a bit more boilerplate. Create a new file
`test_gff.py` and add our test as follows:

```python in test_gff.py
import gff, io, pandas
import unittest

class TestGff(unittest.TestCase):
	test_data = [
		'##gff-version 3',
		'#description: test data',
		'chr1\tme\tgene\t1\t1000\t.\t+\t.\tID=gene1;other_data=stuff',
		'chr1\tme\texon\t10\t900\t.\t+\t.\tID=gene1.1;Parent=gene1'
	]
	.join( '\n' ) # join lines with newline character
    
	def test_parse_gff3_to_dataframe( self ): 
		from io import StringIO
		data = gff.parse_gff3_to_dataframe( StringIO( self.test_data ))
		assert data['seqid'][0] == 'chr1'
		assert data['strand'][0] == '+'
		assert data['attributes'][0] == 'ID=gene1;other_data=stuff'
		assert data['seqid'][1] == 'chr1'
		assert data['strand'][1] == '+'
		assert data['attributes'][1] == 'ID=gene1.1;Parent=gene1'
		assert data['start'][0] == 1
		assert data['end'][0] == 1000
		assert data['start'][1] == 10
		assert data['end'][1] == 900
		from math import isnan
		assert isnan( data['score'][1] ) 
		assert data['ID'][0] == 'gene1'
		assert data['ID'][1] == 'gene1.1'
```

To make this a self-contained program we can tell it to run the tests on the last line:
```python
# add to test_gff.py
unittest.main()
```

Now on the command-line we should be able to do:
```sh
python ./test_gff.py
```

It ought to print something like:

    $ python ./test_gff.py          
    .
    ----------------------------------------------------------------------
    Ran 1 test in 0.018s
    
    OK

Yay!

### Many tests make code work

The great advantage of this is that we can easily add and run more tests, and with each test comes
more confidence that we don't have bugs.



:::tip Challenge
  Add a test for `extract_value_from_attributes()` in there as well.
  Run the test - do all the tests pass?  


:::

***Hint.*** You can find some sensible test code in [the section about extracting the
Parent](Getting_started_writing_code_code.md#extracting-the-parent-as-well). You should place this in a new
function `test_extract_value_from_attributes` after the `test_parse_gff3_to_dataframe` (taking care
to match indentation.)  If in doubt check out the [solution](solutions/part1/test_gff.py).  It should print something like:
```
    $ python ./test_gff.py          
    .
    ----------------------------------------------------------------------
    Ran 2 tests in 0.021s
    
    OK
```



