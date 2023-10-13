---
sidebar_position: 6
---

# Quick recap

We followed a fairly straightforward path to write our `parse_gff_to_dataframe()` function. 

But you should note a few things that we did to make this process as easy as possible - here are a few:

1. We **kept a fast iteration time** - important to avoid getting bored waiting every time to change the code.
2. We **used the [specification](https://m.ensembl.org/info/website/upload/gff3.html)** to know what to aim for, and gave our function a **single well-defined thing to do**.
3. We **created test case(s)** with small datasets and used them to tell when we'd got it right.

The last point is that we **gave our function a good descriptive name**.  

:::tip Note

This last one is super important when you come back to read the data later.  

I was tempted to call this function `parse_gff()` but for me, `parse_gff_to_dataframe()` is easier to understand. After
all, the gff format is kind of hierarchical (i.e. records are linked by ID and Parent fields), so the function *could*
easily have returned some other data structure.  But this one returns a dataframe and I can see it just by reading the
function name.

(But maybe it should be `read_` instead of `parse_`?  Quite possibly!)

:::