---
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Counting genes I

## Some first statistics

[Up to table of contents](README.md)

For simplicity, from here on in we will work with the GFF3 files from the [Ensembl ftp
site](http://ftp.ensembl.org/pub/current_gff3/) - also those from
[PlasmoDB](https://plasmodb.org/plasmo/app/downloads/Current_Release/). These use the terminology `mRNA` for a
gene transcript, and they also have the genome sequence lengths written in the metadata, making life easy for
us. Before starting, download some of these files now.  A guide to the species can be found in the [Ensembl species list](https://www.ensembl.org/info/about/species.html)
and the [Ensembl species tree](https://www.ensembl.org/info/about/speciestree.html).

:::tip Note

If you want a warmup on pandas, try [exploring the GENCODE annotations](./exploring_gencode.md) first. But we'll switch to using
the Ensembl files from now on.

:::

We will focus on protein-coding genes, and their transcripts, exons and coding sequence. They have type `gene`, `mRNA`, `exon`
and `CDS` in the files Ensembl respectively. They come in a basic hierarchy:

- Each gene can have multiple transcripts (i.e. multiple expressed forms at mRNA level - e.g. they
  might differ in how exons are spliced together, or have different transcription start or end
  sites).
  
- Each transcript is made up of one or more exons. The introns in between are spliced out. (This
  happens during the transcription process.)

- Of the exon sequence that makes it into a transcript, only a portion is actually translated into
  the mature protein during processing by the ribosomes. This is the *coding sequence* and the rest
  is *untranslated sequence*.

The files we're looking are (roughly speaking) humanities' best guess at what this picture looks
like in each organism.

We're actually in a good shape for many of [our scientific questions](Introduction.md). Let's start
by counting genes:

### How many genes are there?

Let's start with counting genes - easy! One way is to use sqlite. For example using the sqlite file
you created in the last step:

```
sqlite> SELECT COUNT(*) FROM gff_data WHERE type == `gene` ;
```

*Note.* I ran the above command interactively in sqlite3 - you get there by typing `sqlite3 genes.sqlite` in the shell.
Type `.quit` to quit.)

If you followed the suggestions, or used my version of the code, your file will also have an `analysis` column
that lets you differentiate the records for different species. So you can make these counts for multiple species:

```
sqlite> .mode column
sqlite> .header on
sqlite> SELECT analysis, COUNT(*) FROM gff_data WHERE type=='gene' GROUP BY analysis ;
```

In my data, which includes spiny chromis, dromedary camels, red junglefowl, humans, mice, chimpanzees, and
malaria parasites, this gives:

    analysis                                     COUNT(*)  
    -------------------------------------------  ----------
    Acanthochromis_polyacanthus.ASM210954v1.104  24027     
    Camelus_dromedarius.CamDro2.104.chr.gff3     18919     
    Gallus_gallus.GRCg6a.104                     16666     
    Homo_sapiens.GRCh38.104                      21451     
    Mus_musculus.GRCm39.104                      25655     
    Pan_troglodytes.Pan_tro_3.0.104.chr          22056     
    PlasmoDB-54_Pfalciparum3D7                   5318      

:::tip Note
To make the above query work the [*P.falciparum* data from
PlasmoDB](https://plasmodb.org/plasmo/app/downloads/Current_Release/), I kludged it by running this sql:
```
UPDATE genes
SET type = 'gene', biotype = 'protein_coding_gene'
WHERE analysis == 'PlasmoDB-54_Pfalciparum3D7'
AND type == 'protein_coding_gene' ;
```

I wouldn't generally recommend this type of manually-fix-the-data-until-it-works approach
(not least because it would have to be re-done every time we imported new data) but it'll do for this tutorial.
:::

You can also do this type of thing pretty easily in python or R. Here is the same 'group by' operation done using
pandas or dplyr:
<Tabs>
<TabItem value="python" label="Python code">

```
import pandas, sqlite3
db = sqlite3.connect( "genes.sqlite" )
genes = pandas.read_sql( "SELECT * FROM gff_data WHERE type == 'gene'", db )
(
    genes
    .groupby( "analysis" )
    .size()
)
```


</TabItem>
<TabItem value="R" label="R code">

```
library( RSQLite )
library( dplyr )
db = dbConnect( dbDriver( "SQLite" ), "genes.sqlite" )
genes = dbGetQuery( db, "SELECT * FROM gff_data WHERE type == 'gene'" )
(
    genes
    %>% group_by( analysis )
    %>% summarise( count = n() )
)
```

</TabItem>
</Tabs>

This produces:

    analysis
    Acanthochromis_polyacanthus.ASM210954v1.104    24027
    Camelus_dromedarius.CamDro2.104.chr.gff3       18919
    Gallus_gallus.GRCg6a.104                       16666
    Homo_sapiens.GRCh38.104                        21451
    Mus_musculus.GRCm39.104                        25655
    Pan_troglodytes.Pan_tro_3.0.104.chr            22056
    PlasmoDB-54_Pfalciparum3D7                      5318
    dtype: int64


Interestingly, both [house mice](https://en.wikipedia.org/wiki/House_mouse) and [spiny
chromis](https://en.wikipedia.org/wiki/Spiny_chromis) have more (annotated) genes than humans.
Chimpanzees have a similar number, while [Red
junglefowl](https://en.wikipedia.org/wiki/Red_junglefowl) and [Dromedary
Camels](https://en.wikipedia.org/wiki/Dromedary) have respectively 17% and 5% fewer (annotated)
protein-coding genes than humans. *Plasmodium falciparum* has about a quarter of the number of
genes. (But that's still pretty impressive because its genome size is less than a hundredth that of
humans.)

### What are all these species?

If you're wondering that - it's time to look at [OneZoom.org](http://www.onezoom.org) or the [Ensembl species
tree](https://www.ensembl.org/info/about/speciestree.html). Did you know that Dolphins, like
Camels, are [cloven-hoofed ungulates](http://www.onezoom.org/life/@Cetartiodactyla=622916)?

### What kinds of gene are there?

The above counts all "genes".  But what exactly are these?

One way to figure this out is by comparing to the other records in there. You can find all the top-level record
types (those with no `Parent`) in the file like this:

```
import pandas, sqlite3
db = sqlite3.connect( "genes.sqlite" )
types = pandas.read_sql(
    "SELECT analysis, type, COUNT(*) FROM gff_data WHERE Parent IS NULL GROUP BY analysis, type",
    db
)
print( types )
```

All the species have `pseudogenes` and `non-coding RNAs` as well as genes.

**Question:** What are pseudogenes and non-coding RNAs anyway? Look them up on [the sequence
ontology](http://www.sequenceontology.org/so_wiki/index.php/Category:SO:SOFA). Here is [an
interesting reference on pseudogenes](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3491395/) and on
[non-coding RNAs](https://www.frontiersin.org/articles/10.3389/fgene.2015.00002/full).

(Some of the files also have `region` and `biological_region` records - my guess is these are computational
predictions of regions with biological function - e.g. transcript start sites from
[Eponine](https://www.sanger.ac.uk/tool/eponine/).)

What sets apart *genes* from *pseudogenes* and *non-coding RNAs* is that they code for proteins.
However, it's not quite that simple. If you look more closely at the records with `type=gene`,
you'll see they actually have a second `type` field - it is called `biotype` and is buried in the
attributes. This `biotype` tells us some extra information about the gene. To let us look at this
we need to update the code.

:::tip Challenge

Update your `gff.py` code to make it easy to get this information out - i.e. by adding the `biotype` as an extra column. (It
would also be useful to extract the `Name`, which contains gene names.)

:::

**Hints:** 

- You already extracted `ID` and `Parent` into dedicated columns - it ought to be easy to get
  other attributes as well?

- If making changes feels difficult in your code - I suggest you might want to [try a
  refactor](Refactoring_makes_code_better.md) first - that is, make changes to your code to make it simpler
  without changing its behaviour. Since you have a good test you can make changes quite safely because the tests
  will ensure that it still works correctly. Once the code feels nice and simple, it will be much easier to see
  how to make changes.

- Maybe you should just make `parse_gff3_to_dataframe()` take a list of attributes to extract - that is, let the
  user decide what they want?
  
- **Extra challenge**: Wouldn't it be good if we could remove the attributes we've put into columns (`ID`, `Parent`, `Name` and
  `biotype` say) from the `attributes` column as well? (Note: this will change the behaviour slightly - remember to add a test
  for this new functionality.)\

- **Extra super-difficult challenge**: Do this without using ridiculous amounts of memory.

**More hints:** My solutions are in
[this folder](https://github.com/whg-training/whg-training-resources/blob/main/docs/programming/programming_with_gene_annotations/solutions/part2)
if you want to take a look. The first version, [gff_highmem.py](solutions/part2/gff_highmem.py), extracts any attribute and looks relatively simple.
But it turns out to [use up huge amounts of memory](./Memory_issues_and_how_to_solve_them.md). The second version uses a *chunking* strategy to remove
the attributes, and this helps control the memory.  On my laptop the various versions behave a bit differently:

|    Version             | time taken to load GENCODE data | Max memory usage |
| ---------------------- | ------------------------------- | ---------------- |
| Original               | About 18 seconds                | About 2.4Gb      |
| First version above    | About 28 seconds                | About 3.8Gb      |
| Version using chunking | Also about 29 seconds           | About 2.6Gb      |

Now let's talk more about [Investigating protein-coding genes](Counting_genes_2.md).
